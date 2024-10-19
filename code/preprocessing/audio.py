# import speech_recognition as sr
# from pydub import AudioSegment
# import os
# import sys

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# def convert_mp3_to_wav(mp3_file_path, wav_file_path):
#     audio = AudioSegment.from_mp3(mp3_file_path)
#     audio.export(wav_file_path, format="wav")

# # Example usage:
# convert_mp3_to_wav("./../data/audio.mp3", "./../data/audio.wav")


# def audio_to_text(audio_file_path):
#     recognizer = sr.Recognizer()

#     try:
#         with sr.AudioFile(audio_file_path) as source:
#             audio_data = recognizer.record(source)

#             text = recognizer.recognize_google(audio_data)
#             print("Text recognized from the audio:")
#             print(text)
#             return text

#     except sr.UnknownValueError:
#         print("Sorry, I could not understand the audio.")
#         return None
#     except sr.RequestError as e:
#         print(f"Could not request results from Google Speech Recognition service; {e}")
#         return None

# # Example usage:
# # audio_to_text("./../data/audio.wav")
