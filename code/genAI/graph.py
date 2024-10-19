import os
import sys
import json
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from langchain_groq import  ChatGroq
from langchain_experimental.graph_transformers import LLMGraphTransformer
# from langchain.text_splitter import TokenTextSplitter
from langchain_core.documents import Document
# from langchain_core.prompts import ChatPromptTemplate
from langchain.prompts import PromptTemplate
# from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
import time
from langchain_openai import ChatOpenAI

openai_api_key = os.environ["OPENAI_API_KEY"]

# from langchain.schema import RunnableSequence
# from langchain_google_genai import ChatGoogleGenerativeAI

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils import read_file, write_text_to_file

text = read_file('D:\\Wells Fargo Hackathon\\NITK_Knowledge_Distiller_App\\code\\data\\test.txt')
# token_splitter = TokenTextSplitter(chunk_size=1000,chunk_overlap=100)
# chunks = token_splitter.split_text(text)
chunks = [text]
# print(len(chunks))


# llm = ChatGroq(model="llama-3.1-70b-versatile")
# llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18")
llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18")


llm_transformer = LLMGraphTransformer(llm=llm)

documents = [Document(page_content=chunk) for chunk in chunks]


def format_graph_documents(graph_documents, output_file_path):
    formatted_output = []

    for graph_document in graph_documents:
        # Append a title for each graph document
        formatted_output.append("Graph Document:")
        formatted_output.append("=" * 50)

        # Format nodes
        formatted_output.append("Nodes:")
        for node in graph_document.nodes:
            node_info = f"ID: {node.id}, Type: {node.type}, Properties: {node.properties}"
            formatted_output.append(node_info)

        # Format relationships
        formatted_output.append("\nRelationships:")
        for relationship in graph_document.relationships:
            rel_info = (f"Source: {relationship.source.id} (Type: {relationship.source.type}), "
                        f"Target: {relationship.target.id} (Type: {relationship.target.type}), "
                        f"Type: {relationship.type}, Properties: {relationship.properties}")
            formatted_output.append(rel_info)

        # Add a separator between graph documents
        formatted_output.append("\n" + "=" * 50 + "\n")

    # Write the formatted output to the specified file
    with open(output_file_path, 'w') as f:
        f.write("\n".join(formatted_output))

    print(f"Graph documents formatted and written to {output_file_path}")

# format_graph_documents(graph_documents, 'D:\\Wells Fargo Hackathon\\NITK_Knowledge_Distiller_App\\code\\data\\formatted_graph_documents2.txt')



def generate_graph(text, max_retries=13, retry_delay=2):
    documents = [Document(page_content=text)]
    
    for attempt in range(max_retries):
        try:
            
            graph_documents = llm_transformer.convert_to_graph_documents(documents)
            
            node_ids = [node.id for node in graph_documents[0].nodes]

            relationship_data = [
                [relationship.source.id, relationship.target.id, relationship.type]
                for relationship in graph_documents[0].relationships
            ]
            print("\n"+"="*50+str(len(node_ids))+"\n"+"="*50)
            return node_ids, relationship_data

        except Exception as e:
            print(f"Error during graph conversion (attempt {attempt+1}/{max_retries}): {e}")
            
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                print(f"Max retries reached. Failed to convert text to graph.")
                raise e





def get_concept_definitions(concepts, max_retries=13, retry_delay=2):
    class ConceptDefinition(BaseModel):
        title: str = Field(description="The title of the concept")
        definition: str = Field(description="A brief definition of the concept")

    class ConceptListParser(PydanticOutputParser):
        def parse(self, text: str) -> List[ConceptDefinition]:
            try:
                parsed_output = eval(text)
                return [ConceptDefinition(**item) for item in parsed_output]
            except SyntaxError as e:
                raise ValueError(f"Failed to parse concept definitions: {e}")

    parser = ConceptListParser(pydantic_object=ConceptDefinition)

    template = """
    You are an expert. Please provide a brief definition for each of the following concepts:
    
    {concepts}
    
    Return the response as a valid JSON array of dictionaries, without any additional text. The format should be:
    [
        {{"title": "Concept Title", "definition": "Brief definition of the concept"}},
        ...
    ]
    """

    prompt = PromptTemplate(
        input_variables=["concepts"],
        template=template
    )

    # llm = ChatGroq(model="llama-3.1-70b-versatile")

    # Combine prompt and LLM
    chain = prompt | llm

    concepts_text = "\n".join(f"- {concept}" for concept in concepts)

    for attempt in range(max_retries):
        try:
            # Get response from the LLM
            response = chain.invoke({"concepts": concepts_text})

            # Load the response content
            parsed_definitions = json.loads(response.content)

            # Extract titles from parsed definitions
            output_titles = [definition["title"].strip().lower() for definition in parsed_definitions]

            # Create a normalized version of input concepts
            normalized_concepts = [concept.strip().lower() for concept in concepts]

            # Validate that all titles are present (case insensitive)
            if not all(title in output_titles for title in normalized_concepts):
                raise ValueError("Some concepts are missing or altered in the response.")

            return parsed_definitions

        except Exception as e:
            # Log the error and retry if attempts are left
            print(f"Error during concept definition retrieval (attempt {attempt+1}/{max_retries}): {e}")
            
            if attempt < max_retries - 1:
                # Wait for a specified delay before retrying
                time.sleep(retry_delay)
            else:
                # If out of retries, raise the exception
                print("Max retries reached. Failed to retrieve concept definitions.")
                raise e