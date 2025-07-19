import os
import re
import requests
from urllib.parse import urlparse, parse_qs

AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'audio')
os.makedirs(AUDIO_DIR, exist_ok=True)
README_PATH = os.path.join(os.path.dirname(__file__), 'README_url.md')

with open(README_PATH, encoding='utf-8') as f:
    content = f.read()

# 匹配所有表格行，提取单词和所有语音链接
row_pattern = re.compile(r'\|\s*(\w+)\s*\|([^\n]+)')
rows = row_pattern.findall(content)

# 匹配所有语音链接
audio_link_pattern = re.compile(r'\[🔊\]\(([^)]+)\)')

def get_filename(word, url, idx):
    # 解析来源和类型
    parsed = urlparse(url)
    ext = os.path.splitext(parsed.path)[-1] or '.mp3'
    return f"{word}_audio_{idx}{ext}"

def download(url, filename):
    try:
        resp = requests.get(url, timeout=15)
        if resp.status_code == 200:
            with open(os.path.join(AUDIO_DIR, filename), 'wb') as f:
                f.write(resp.content)
            print(f"下载成功: {filename}")
        else:
            print(f"下载失败: {filename} 状态码:{resp.status_code}")
    except Exception as e:
        print(f"下载异常: {filename} 错误:{e}")

for row in rows:
    word = row[0]
    line = row[1]
    links = audio_link_pattern.findall(line)
    for idx, url in enumerate(links, 1):
        filename = get_filename(word, url, idx)
        download(url, filename)

print("全部下载完成！")
