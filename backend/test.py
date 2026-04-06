import requests

url = "http://127.0.0.1:8000/caption"

with open("test_image.jpg", "rb") as f:
    files = {"file": ("test_image.jpg", f, "image/jpeg")}
    data = {"style": "descriptive"}
    response = requests.post(url, files=files, data=data)

print(response.status_code)
print(response.text)