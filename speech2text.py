#install speech_recognition
#intall pyAudio

import speech_recognition as sr
r = sr.Recognizer()
harvard = sr.AudioFile('mark.wav')
with harvard as source:
    #the below command is for removing the noice , in our scenario , its not working fine.
    #So we are not using it . We can try more cases with it though
    #r.adjust_for_ambient_noise(source)
    audio = r.record(source)
r.recognize_google(audio)
