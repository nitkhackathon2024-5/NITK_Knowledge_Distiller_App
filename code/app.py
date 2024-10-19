from flask import Flask, request, jsonify, session, redirect, url_for
from firebase_admin import credentials, firestore, initialize_app, auth, storage
from werkzeug.utils import secure_filename
import os
import mimetypes
# from preprocessing.utils import pdf_to_text
from utils import pdf_to_text
from genAI.graph import generate_graph, get_concept_definitions
# from pdfminer.high_level import extract_text
import io
from flask_cors import CORS
from PyPDF2 import PdfReader
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

cred = credentials.Certificate('./serviceAccountKey.json')
initialize_app(cred, {
    'storageBucket': f'{os.environ["FIREBASE_BUCKET_NAME"]}.appspot.com'
})
# initialize_app(cred, {
#     'storageBucket': 'knowledge-distiller.appspot.com'
# })
db = firestore.client()
bucket = storage.bucket()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
app.config['SECRET_KEY'] = 'your_secret_key'

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'txt', 'mp3', 'wav'}

# Helper function to check file type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_text_content(file):
    filename = file.filename
    mime_type, encoding = mimetypes.guess_type(filename)

    if mime_type is None:
        return ""

    if mime_type.startswith("text"):
        text = file.read().decode('utf-8')
        return text

    elif mime_type == "application/pdf":
        return pdf_to_text(file)

    elif mime_type.startswith("image"):
        return ""

    elif mime_type.startswith("audio"):
        return ""

    else:
        return ""
    

def archive_graph(graph_ref, graph_data):
    # db.collection('graphs').document(graph_ref.id).collection('previous_versions').add(graph_data)

    graph_ref.delete()



def create_or_update_graph(user_id, text, file_urls, graph_ref=None):
    if graph_ref:
        delete_graph_subcollections(graph_ref)

        graph_ref.update({
            'files': file_urls
        })
    else:
        graph_ref = db.collection('graphs').add({
            'userId': user_id,
            'files': file_urls
        })[1]

    nodes, relations = generate_and_fill_graph(text)

    node_ids = {}
    frontend_data = []
    for node in nodes:
        node_ref = graph_ref.collection('nodes').add({
            'title': node['title'],
            'definition': node['definition'],
        })[1]
        node_ids[node['title']] = node_ref

        # create data for frontend
        frontend_data.append({
            "data": {
                "id": node['title'],  # Use node title as id
                "category": "Concept",  # Assuming all nodes are of category 'Concept'
                "content": node['definition']  # Node definition as content
            }
        })

    for relation in relations:
        source_id = node_ids.get(relation[0])
        target_id = node_ids.get(relation[1])
        source = relation[0]
        target = relation[1]
        relation_type = relation[2]

        if source_id and target_id:
            graph_ref.collection('relations').add({
                'source_id': source_id,
                'target_id': target_id,
                'source': source,
                'target': target,
                'type': relation_type
            })
        frontend_data.append({
            "data": {
                "source": relation[0],  # Use source node title
                "target": relation[1],  # Use target node title
                "Type": relation_type  # Use the relation type
            }
        })

    return graph_ref.id, frontend_data


def delete_graph_subcollections(graph_ref):
    # Delete all nodes
    nodes_ref = graph_ref.collection('nodes')
    for node in nodes_ref.stream():
        node.reference.delete()

    # Delete all relations
    relations_ref = graph_ref.collection('relations')
    for relation in relations_ref.stream():
        relation.reference.delete()





@app.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email')
    password = request.json.get('password')
    name = request.json.get('name')
    
    if not email or not password or not name:
        return jsonify({'error': 'Email and password and name are required'}), 400
    
    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        auth.update_user(
            user.uid,
            display_name=name
        )
        session['user_id'] = user.uid
        return jsonify({
            'message': 'User created successfully',
            'user_id': user.uid
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Login route
@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    print(email), print(password)
    # email = request.form['email']
    # password = request.form['password']
    try:
        user = auth.get_user_by_email(email)
        print(user)
        session['user_id'] = user.uid
        return jsonify({
            'message': 'User logged in successfully',
            'user_id': user.uid
        }), 200
        # return redirect(url_for('upload_file'))
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400
        # return f"An error occurred: {str(e)}"



@app.route('/createGraph', methods=['POST'])
def create_graph():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    print(request)
    # Process uploaded files
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('file')
    if not files:
        return "No files uploaded", 400
    
    file_urls = []
    text = ""

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            text_content = get_text_content(file)
            if text_content:
                text += f"\n\n{filename}\n{text_content}"
            file.seek(0)
            
            # Upload file to Firebase Storage
            blob = bucket.blob(f"user_uploads/{session['user_id']}/{filename}")
            blob.upload_from_file(file)
            # blob.make_public()
            
            file_urls.append(blob.public_url)

    graph_id, frontend_data = create_or_update_graph(session['user_id'], text, file_urls)

    return jsonify({'message': 'Graph created successfully', 'graphId': graph_id, 'data':frontend_data}), 200

def generate_and_fill_graph(text):
    nodes, relations = generate_graph(text)
    nodes = get_concept_definitions(nodes)
    print(nodes)
    print(relations)
    return nodes, relations



@app.route('/updateGraph', methods=['POST'])
def update_graph():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    data = request.form
    print(data)
    graph_id = data['graph_id']
    action = data['action']
    graph_ref = db.collection('graphs').document(graph_id)
    graph = graph_ref.get()
    if not graph.exists:
        return jsonify({'error': 'Graph not found'}), 404
    graph = graph.to_dict()
    # print(graph)

    text = ""
    file_urls = graph.get('files', [])
    
    if action == 'add':
        files = request.files.getlist('file')
        new_file_urls = []

        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # text_content = get_text_content(file)
                # if text_content:
                #     text += f"\n\n{filename}\n{text_content}"
                file.seek(0)
                
                # Upload file to Firebase Storage
                blob = bucket.blob(f"user_uploads/{session['user_id']}/{filename}")
                blob.upload_from_file(file)
                
                file_urls.append(blob.public_url)


    elif action == 'remove':
        remove_files = data.getlist('files')
        # remove_files = data.get('files', [])
        print(remove_files)
        print("="*50+str(len(file_urls))+"="*50)
        file_urls = [url for url in file_urls if url not in remove_files]
        print("="*50+str(len(file_urls))+"="*50)

        # Delete removed files from Firebase Storage
        for remove_file in remove_files:
            print(remove_file)
            print(remove_file.split('/')[-1])
            # blob = bucket.blob(f"user_uploads/{session['user_id']}/{remove_file.split('/')[-1]}")
            blob = bucket.blob(f"user_uploads/{session['user_id']}/{remove_file}")
            blob.delete()
        
        updated_original_files = [url for url in file_urls if url.split('/')[-1] not in remove_files]
        file_urls = updated_original_files

    # Combine text from all files
    for url in file_urls:
        filename = url.split('/')[-1]
        file_blob = bucket.blob(f"user_uploads/{session['user_id']}/{filename}")
        try:
            file_stream = file_blob.download_as_bytes()
            
            # Handle different file types
            if filename.lower().endswith(('.txt', '.md', '.csv')):
                text_content = file_stream.decode('utf-8')
                text += f"\n\n{filename}\n{text_content}"
                
            elif filename.lower().endswith('.pdf'):
                # Convert bytes to file-like object for PDF reading
                pdf_file = io.BytesIO(file_stream)
                pdf_reader = PdfReader(pdf_file)
                
                # Extract text from each page
                pdf_text = ""
                for page in pdf_reader.pages:
                    pdf_text += page.extract_text()
                
                text += f"\n\n{filename}\n{pdf_text}"
                
            elif filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                # Handle images if needed
                pass
                
        except Exception as e:
            print(f"Error processing {filename}: {str(e)}")
            continue
    print(text)
    # Archive the old graph and create a new one using the updated files
    # archive_graph(graph_ref, graph)  # Archive the current graph

    # update the graph with updated files and nodes
    new_graph_id, frontend_data = create_or_update_graph(session['user_id'], text, file_urls,graph_ref)

    return jsonify({'message': 'Graph updated successfully', 'new_graph_id': new_graph_id, 'data':frontend_data}), 200


# Route to get all graphs associated with a user
@app.route('/user/<user_id>/graphs', methods=['GET'])
def get_user_graphs(user_id):
    try:
        graphs_ref = db.collection('graphs').where('userId', '==', user_id)
        graphs = graphs_ref.stream()

        graph_list = []
        
        for graph in graphs:
            graph_data = graph.to_dict()
            graph_data['graph_id'] = graph.id
            graph_list.append(graph_data)

        return jsonify({
            # 'message': f'Graphs retrieved for user {user_id}',
            'graphs': graph_list
        }), 200
    except Exception as e:
        print(f"Error retrieving graphs for user {user_id}: {e}")
        return jsonify({'error': str(e)}), 400
    

# class FirestoreEncoder(JSONEncoder):
#     def default(self, obj):
#         if isinstance(obj, DocumentReference):
#             return str(obj.path)
#         return super().default(obj)

# # Initialize Flask with custom encoder
# app = Flask(__name__)
# app.json_encoder = FirestoreEncoder

@app.route('/user/<user_id>/graphs/<graph_id>', methods=['GET'])
def get_specific_graph_with_subcollections(user_id, graph_id):
    try:
        collection_ref = db.collection("graphs")
    
        # Get all documents in the collection
        documents = collection_ref.get()
        graph = None
        
        for doc in documents:
            if(doc.id != graph_id):
                continue
            graph = doc.to_dict()
            # Get reference to subcollection
            subcollection_ref = collection_ref.document(doc.id).collection("nodes")
            subcollection_ref2 = collection_ref.document(doc.id).collection("relations")
            
            # Get all documents in subcollection
            subcollection_docs = subcollection_ref.get()
            subcollection_docs2 = subcollection_ref2.get()

            data = backend_format_to_frontend(subcollection_docs, subcollection_docs2)
            
            # for subdoc in subcollection_docs:
            #     print("Sub Document ID:", subdoc.id)
            #     # If you need the data as well:
            #     print("Sub Document Data:", subdoc.to_dict())
            # for subdoc in subcollection_docs2:
            #     print("Sub Document ID:", subdoc.id)
            #     # If you need the data as well:
            #     print("Sub Document Data:", subdoc.to_dict())
        return jsonify({
            'message': 'Graph retrieved successfully',
            'graph': graph,
            'data': data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
def backend_format_to_frontend(nodes, relations):
    frontend_data = []

    # Convert nodes to the frontend format
    for node in nodes:
        node = node.to_dict()
        frontend_data.append({
            "data": {
                "id": node['title'],  # Use 'title' as the 'id'
                "category": "Concept",  # Assuming the category is always 'Concept'
                "content": node['definition']  # Use 'definition' as the 'content'
            }
        })

    # Convert relations to the frontend format
    for relation in relations:
        relation = relation.to_dict()
        frontend_data.append({
            "data": {
                "source": relation['source'],  # Use 'source' as the source node
                "target": relation['target'],  # Use 'target' as the target node
                "Type": relation['type']  # Use 'type' as the relation type
            }
        })

    return frontend_data





@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)