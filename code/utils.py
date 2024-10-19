import PyPDF2


def write_text_to_file(file_path, text):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(text)

def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        return content

def pdf_to_text(uploaded_file):

    reader = PyPDF2.PdfReader(uploaded_file)
    text = ""
    
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text += page.extract_text()
    
    return text