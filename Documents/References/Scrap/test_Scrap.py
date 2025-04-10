import pytest
from unittest.mock import patch, MagicMock
from bs4 import BeautifulSoup
import requests
from urllib.parse import urlparse, parse_qs

# Import the functions to test from Scrap.py
from Scrap import get_post_urls_with_filter, scrape_post_details

# 테스트용 HTML 마크업
SAMPLE_PAGE_HTML = """
<html>
<body>
    <table>
        <tr>
            <td class="fz_subject">
                <a href="/post1.php?wr_id=1">일반 게시글</a>
            </td>
        </tr>
        <tr>
            <td class="fz_subject">
                <a href="/post2.php?wr_id=2">Re: 답변 게시글</a>
            </td>
        </tr>
        <tr>
            <td class="fz_subject">
                <a href="/post3.php?wr_id=3">또 다른 일반 게시글</a>
            </td>
        </tr>
        <tr>
            <td class="fz_subject">
                <a href="/post4.php?wr_id=4">Re: 또 다른 답변</a>
            </td>
        </tr>
    </table>
    <div class="pg_wrap">
        <a href="?page=1" class="pg_page">1</a>
        <a href="?page=2" class="pg_page">2</a>
        <a href="?page=3" class="pg_page">3</a>
    </div>
</body>
</html>
"""

SAMPLE_POST_HTML = """
<html>
<body>
    <div id="bo_v_title">Re: 테스트 제목</div>
    <div id="bo_v_info">
        <span class="sv_member">테스트작성자</span>
    </div>
    <div id="bo_v_con">테스트 내용입니다.</div>
</body>
</html>
"""

@pytest.fixture
def mock_response():
    """Mock HTTP 응답 객체 생성"""
    mock = MagicMock()
    mock.text = SAMPLE_PAGE_HTML
    return mock

@pytest.fixture
def mock_post_response():
    """개별 게시글 응답 Mock"""
    mock = MagicMock()
    mock.text = SAMPLE_POST_HTML
    return mock

@patch('requests.get')
def test_get_post_urls_with_filter(mock_get, mock_response):
    """Re: 포함된 게시글 URL만 추출하는지 테스트"""
    # requests.get() 호출 시 mock_response 반환하도록 설정
    mock_get.return_value = mock_response
    
    # 테스트 실행
    result = get_post_urls_with_filter("http://example.com/board.php?bo_table=test")
    
    # 결과 검증 - "Re:" 포함된 게시글 URL만 추출되었는지 확인
    assert len(result) == 2  # "Re:"가 포함된 게시글은 2개
    # URL이 올바르게 생성되었는지 확인
    assert any("post2.php?wr_id=2" in url for url in result)
    assert any("post4.php?wr_id=4" in url for url in result)

@patch('requests.get')
def test_scrape_post_details(mock_get, mock_post_response):
    """게시글 상세 정보 추출 테스트"""
    # 요청 시 mock_post_response 반환
    mock_get.return_value = mock_post_response
    
    # 테스트 실행
    result = scrape_post_details("http://example.com/post2.php?wr_id=2")
    
    # 결과 검증
    assert result is not None
    assert result["title"] == "Re: 테스트 제목"
    assert result["author"] == "테스트작성자"
    assert result["content"] == "테스트 내용입니다."
    assert result["url"] == "http://example.com/post2.php?wr_id=2"
    
@patch('requests.get')
def test_pagination_detection(mock_get, mock_response):
    """페이지네이션 감지 테스트"""
    mock_get.return_value = mock_response
    
    # 테스트 함수 재정의 (페이지 감지 부분만 테스트)
    def test_pagination():
        response = requests.get("http://example.com/board.php")
        soup = BeautifulSoup(response.text, 'html.parser')
        pagination = soup.select('.pg_page')
        if pagination:
            page_numbers = [int(p.get_text()) for p in pagination if p.get_text().isdigit()]
            if page_numbers:
                max_page = max(page_numbers)
                return max_page
        return 1
    
    # 테스트 실행
    max_page = test_pagination()
    
    # 결과 검증
    assert max_page == 3  # 샘플 HTML에는 1, 2, 3 페이지가 있음

@patch('requests.get')
def test_url_parsing(mock_get):
    """URL 파싱 테스트"""
    url = "http://example.com/board.php?bo_table=test&page=1"
    parsed_url = urlparse(url)
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}"
    query_params = parse_qs(parsed_url.query)
    
    assert base_url == "http://example.com/board.php"
    assert query_params['bo_table'] == ['test']
    assert query_params['page'] == ['1']
    
    # 페이지 변경 테스트
    query_params['page'] = [2]
    page_query = '&'.join([f"{k}={v[0]}" for k, v in query_params.items()])
    page_url = f"{base_url}?{page_query}"
    
    assert page_url == "http://example.com/board.php?bo_table=test&page=2" 