import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse, parse_qs

# BeautifulSoup의 선택자 기능 확장 (contains 셀렉터 지원)
from bs4.element import Tag

# contains 셀렉터 구현 (예: a:contains("text"))
def select_with_contains(tag, selector):
    if ':contains(' not in selector:
        return tag.select(selector)
    
    # :contains() 선택자 파싱
    base_selector, contains_text = selector.split(':contains(', 1)
    contains_text = contains_text.rstrip(')')
    contains_text = contains_text.strip('"\'')
    
    # 기본 셀렉터로 요소들 찾기
    elements = tag.select(base_selector)
    # 텍스트를 포함하는 요소만 필터링
    return [el for el in elements if contains_text in el.get_text()]

# BeautifulSoup select 메소드 오버라이드
original_select = BeautifulSoup.select
def patched_select(self, selector):
    if ':contains(' in selector:
        return select_with_contains(self, selector)
    return original_select(self, selector)

BeautifulSoup.select = patched_select

def get_post_urls_with_filter(board_url, title_filter="Re:"):
    """게시판의 모든 페이지에서 특정 제목 필터에 맞는 게시글 URL 목록을 가져온다."""
    all_post_links = []
    current_page = 1
    max_page = float('inf')  # 일단 무한대로 설정하고 페이지가 없을 때까지 탐색
    page_has_content = True  # 페이지에 내용이 있는지 확인하는 플래그
    
    # URL에서 기본 URL과 쿼리 파라미터 분리
    parsed_url = urlparse(board_url)
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}"
    query_params = parse_qs(parsed_url.query)
    
    print(f"게시글 URL 추출 시작...")
    
    while current_page <= max_page and page_has_content:
        # 현재 페이지 URL 생성
        query_params['page'] = [current_page]
        page_query = '&'.join([f"{k}={v[0]}" for k, v in query_params.items()])
        page_url = f"{base_url}?{page_query}"
        
        print(f"페이지 {current_page} 처리 중: {page_url}")
        
        try:
            response = requests.get(page_url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 게시글 목록에서 제목을 확인하여 필터링
            subject_rows = soup.select('td.fz_subject')
            
            # 페이지에 게시글이 없다면 종료
            if not subject_rows:
                print(f"페이지 {current_page}에 게시글이 없습니다. 스크랩을 종료합니다.")
                page_has_content = False
                break
            
            found_titles = False  # 이 페이지에서 제목을 찾았는지 확인
            for subject_cell in subject_rows:
                link = subject_cell.find('a')
                if not link:
                    continue
                    
                # 제목 추출 (Re: 필터링을 위해)
                title = link.get_text(strip=True)
                href = link.get('href')
                
                # 제목에 'Re:'가 포함된 게시글만 추가
                if title_filter in title and href and 'wr_id=' in href:
                    found_titles = True
                    # 상대 경로일 경우 절대 경로로 변환
                    if not href.startswith('http'):
                        href = urljoin(page_url, href)
                    all_post_links.append(href)
            
            # 첫 페이지에서만 "마지막" 페이지 링크를 확인하여 전체 페이지 수를 추정
            if current_page == 1:
                # "마지막" 페이지 링크 찾기 (보통 "»" 또는 특정 클래스로 표시됨)
                last_page_link = None
                
                # 다양한 마지막 페이지 선택자 시도
                last_page_selectors = [
                    'a[href*="page="][href*="tail"]',  # 마지막 페이지 링크
                    'a.pg_end',                      # 마지막 페이지 클래스
                    '.pg_wrap a:last-child',         # 페이지 래퍼의 마지막 링크
                    '.pagination a:last-child',      # 페이지네이션의 마지막 링크
                    'a:contains("»")',              # » 기호가 있는 링크
                    'a:contains("마지막")'           # "마지막"이라는 텍스트가 있는 링크
                ]
                
                for selector in last_page_selectors:
                    try:
                        elements = soup.select(selector)
                        if elements:
                            last_page_link = elements[-1]
                            break
                    except Exception:
                        continue
                
                # 마지막 페이지 링크를 찾았다면 URL에서 페이지 번호 추출
                if last_page_link and last_page_link.has_attr('href'):
                    last_page_url = last_page_link['href']
                    last_page_parsed = urlparse(last_page_url)
                    last_page_params = parse_qs(last_page_parsed.query)
                    
                    if 'page' in last_page_params:
                        try:
                            max_page = int(last_page_params['page'][0])
                            print(f"마지막 페이지 링크를 통해 총 {max_page}개의 페이지가 감지되었습니다.")
                        except (ValueError, IndexError):
                            print("마지막 페이지 번호를 추출할 수 없습니다. 페이지가 없을 때까지 계속 탐색합니다.")
                
                # 마지막 페이지를 찾지 못했다면 일반 페이지네이션 확인
                if max_page == float('inf'):
                    # 여러 페이지네이션 선택자 시도
                    pagination_selectors = [
                        '.pg_page',            # 기존 선택자
                        '.pg_wrap a',          # 페이지 링크
                        '.pg_wrap span',       # 현재 페이지 및 다른 페이지 번호
                        '.pg a',               # 간단한 선택자
                        '.pagination a',       # Bootstrap 스타일
                        '.board_page a',       # 일반적인 게시판 스타일
                        'a.pg_page'            # 클래스 이름이 있는 a 태그
                    ]
                    
                    for selector in pagination_selectors:
                        pagination = soup.select(selector)
                        if pagination:
                            # 숫자만 추출해서 페이지 번호 찾기
                            page_numbers = []
                            for p in pagination:
                                text = p.get_text().strip()
                                # 숫자만 있는 경우
                                if text.isdigit():
                                    page_numbers.append(int(text))
                                # 숫자가 포함된 텍스트인 경우 숫자만 추출
                                else:
                                    numbers = re.findall(r'\d+', text)
                                    for num in numbers:
                                        if num.isdigit():
                                            page_numbers.append(int(num))
                            
                            if page_numbers:
                                found_max_page = max(page_numbers)
                                print(f"선택자 '{selector}'를 사용하여 {found_max_page}개의 페이지가 감지되었지만, 더 많은 페이지가 있을 수 있습니다.")
                                # 여기서는 max_page를 설정하지 않고, 페이지가 없을 때까지 계속 탐색
                                break
                    
                    print("전체 페이지 수를 정확히 파악할 수 없어 페이지가 없을 때까지 계속 탐색합니다.")
            
            # 이 페이지에서 필터링된 게시글을 찾지 못했고, 페이지 번호가 높아질수록
            # 필터링된 게시글이 없을 가능성이 높다면 여기서 종료 조건을 추가할 수 있음
            # 예: if not found_titles and current_page > 20: break
            
            # 다음 페이지로
            current_page += 1
            # 서버 부하 감소를 위한 대기
            time.sleep(1)
            
        except requests.exceptions.RequestException as e:
            print(f"오류 발생: 페이지를 가져오는 중 문제 발생 - {e}")
            break
        except Exception as e:
            print(f"오류 발생: URL 추출 중 예상치 못한 오류 - {e}")
            break
    
    # 중복 제거
    filtered_post_urls = sorted(list(set(all_post_links)))
    print(f"총 {len(filtered_post_urls)}개의 'Re:' 포함 게시글 URL 추출 완료.")
    return filtered_post_urls

def scrape_post_details(post_url):
    """개별 게시글 URL에서 제목, 작성자, 내용을 추출한다."""
    try:
        response = requests.get(post_url, timeout=15) # 타임아웃 조금 길게 설정
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # --- 선택자 추측 ---
        # 제목 찾기 (여러 가능성 시도)
        title_element = soup.select_one('#bo_v_title')
        title = title_element.get_text(strip=True) if title_element else "제목 없음"

        # 작성자 찾기 (회원/비회원)
        author = "작성자 정보 없음"
        author_info_element = soup.select_one('#bo_v_info')
        if author_info_element:
            member_element = author_info_element.select_one('.sv_member')
            guest_element = author_info_element.select_one('.sv_guest')
            if member_element:
                author = member_element.get_text(strip=True)
            elif guest_element:
                # 'sv_guest' 클래스 안에 실제 이름이 있을 수 있음
                author_span = guest_element.find('span', class_=None) # 클래스 없는 span (이름 부분)
                if author_span:
                    author = author_span.get_text(strip=True)
                else: # 못찾으면 그냥 guest 태그 전체 텍스트
                    author = guest_element.get_text(strip=True)


        # 내용 찾기
        content_element = soup.select_one('#bo_v_con')
        # 내용 안의 불필요한 태그나 공백 제거 (필요에 따라 추가 정제 가능)
        content = content_element.get_text(strip=True, separator='\n') if content_element else "내용 없음"
        # --- 선택자 추측 끝 ---

        print(f"스크랩 성공: {post_url} -> 제목: {title[:20]}...") # 로그 추가
        return {
            "url": post_url,
            "title": title,
            "author": author,
            "content": content
        }

    except requests.exceptions.Timeout:
        print(f"오류 발생: 타임아웃 - {post_url}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"오류 발생: 게시글 요청 실패 - {post_url}, 오류: {e}")
        return None
    except Exception as e:
        print(f"오류 발생: 데이터 추출 실패 - {post_url}, 오류: {e}")
        return None # 실패 시 None 반환

# --- 메인 스크립트 로직 수정 ---
if __name__ == '__main__':
    # page=1 파라미터 제거
    target_board_url = "http://xn--od1b68l0cz88csgeeoi.com/bbs/board.php?bo_table=online"
    all_post_data = []

    # "Re:" 포함된 게시글만 추출
    post_urls = get_post_urls_with_filter(target_board_url, title_filter="Re:")

    if post_urls:
        print(f"\n총 {len(post_urls)}개의 'Re:' 포함 게시글 스크래핑 시작...")
        for i, url in enumerate(post_urls):
            print(f"[{i+1}/{len(post_urls)}] 게시글 처리 중: {url}")
            details = scrape_post_details(url)
            if details: # 성공적으로 가져온 경우만 추가
                all_post_data.append(details)
            # 서버 부하를 줄이기 위해 잠시 대기
            time.sleep(1) # 1초 대기 (필요시 조절)

        # 결과를 JSON 파일로 저장
        output_filename = 're_posts_scraped.json'
        try:
            with open(output_filename, 'w', encoding='utf-8') as f:
                json.dump(all_post_data, f, ensure_ascii=False, indent=4)
            print(f"\n스크래핑 완료! 총 {len(all_post_data)}개의 'Re:' 포함 게시글 정보를 '{output_filename}'에 저장했습니다.")
        except IOError as e:
            print(f"오류 발생: JSON 파일 저장 실패 - {e}")
        except Exception as e:
            print(f"오류 발생: JSON 저장 중 예상치 못한 오류 - {e}")

    else:
        print("추출된 'Re:' 포함 게시글 URL이 없어 스크래핑을 진행할 수 없습니다.")
# --- 테스트 코드 끝 ---
