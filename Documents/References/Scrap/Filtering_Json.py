import json
import os

def filter_contents(json_file, output_markdown):
    # JSON 파일 읽기
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # contents만 추출하여 마크다운 형식으로 변환
    markdown_content = ""
    for item in data:
        if "content" in item and item["content"] != "내용 없음":
            # \n을 \\n으로 대체하여 문자 그대로 표시되도록 함
            content = item["content"].replace('\n', '\\n')
            # content를 추출하고 불렛포인트 형식으로 추가
            markdown_content += f"- {content}\n\n"
    
    # 마크다운 파일로 저장
    with open(output_markdown, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print(f"'{output_markdown}' 파일이 생성되었습니다.")

if __name__ == "__main__":
    # 현재 디렉토리에 있는 Posts_Scraped.json 파일 사용
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file = os.path.join(script_dir, "Posts_Scraped.json")
    output_markdown = os.path.join(script_dir, "Response_Doctor.md")
    
    if os.path.exists(json_file):
        filter_contents(json_file, output_markdown)
    else:
        print(f"오류: '{json_file}' 파일을 찾을 수 없습니다.")
