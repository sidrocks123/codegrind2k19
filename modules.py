import re
import json
import datefinder
import editdistance
import sys
import speech_recognition as sr

def speech_module(filename):
    r = sr.Recognizer()
    harvard = sr.AudioFile('mark.wav')
    with harvard as source:
        audio = r.record(source)
text = r.recognize_google(audio)
print(text)

def text_module_main(filename):

    final = []
    f = open(filename, "r")
    for line in f:
        match = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', line)
        if len(match) != 0:
            for x in match:
                final.append(x)

    f.close()

    final = list(set(final))
    for e in final:
        if e.endswith('@gmail.com') or e.endswith('@yahoo.com') or e.endswith('@outlook.com'):
            customer_email = e
            break

    print(customer_email)
    with open('data.json', 'r') as JSON:
        cList = json.load(JSON)

    #customer_email = "khanu@gmail.com"
    #noOfDisputes = 0
    disputes = []
    for x in cList.values():
        if x["Email"] == customer_email:
            reqd_accno = x["AcctNo"]
        #noOfDisputes += len(x["DisputeID"])
        for temp in x["DisputeID"]:
            disputes.append(int(temp))

    print(disputes)
    noOfDisputes = len(disputes)
    if(noOfDisputes != 0):
        maxDisputeID = max(disputes)
    for x in cList.values():
        if x["AcctNo"] == reqd_accno:
            if noOfDisputes == 0:
                newDisputeID = "0001"
                x["DisputeID"].append(newDisputeID)
            else:
                newDisputeID = (4 - len(str(maxDisputeID)))*'0' + str(maxDisputeID + 1)
                x["DisputeID"].append(newDisputeID)
    
    print(customer_email)
    print(reqd_accno)
    #print(json.dumps(cList))
    with open('data.json', 'w') as JSON:
        json.dump(cList, JSON)

    with open('cases.json', 'r') as JSON:
        caseList = json.load(JSON)

    print(json.dumps(caseList))
    probCases = []
    #descriptions = []

    f = open(filename, "r")
    f_text = f.read()
    f.close()
    normSum = 0.0
    flagForOneDisp = False
    oneDisp = []
    for x in caseList.values():
        temp = ''
        for e in x["Keywords"]:
            temp += str(e) + '|'
        temp = temp[:len(temp)-1]
        re_pattern = r'\b(?:{})'.format(temp)
        match = re.findall(re_pattern, f_text)
        prob = round(len(match)/len(x["Keywords"]),2)
        if(prob < 0.80):
            probCases.append([x["Description"],prob])
            normSum += prob
        else:
            oneDisp.append([x["Description"],prob])
            flagForOneDisp = True
            break

    print(probCases)
    if flagForOneDisp == False:
        for p in probCases:
            p[1] = round(p[1]/normSum,2)
        probCases.sort(key = lambda x: x[1], reverse=True)
        del probCases[2:]

    else:
        probCases = oneDisp

    new_final = {}
    new_final[newDisputeID[::-1]] = {"DisputeId": newDisputeID,"ProbCases":probCases}
    print(new_final)
    with open('final.json','r') as JSON:
        try:
            final = json.load(JSON)
        except:
            final = {}
    final.update(new_final)
    with open('final.json','w') as JSON:
        json.dump(final, JSON)
    

if __name__ == "__main__":
    filename = sys.argv[2]
    flag = sys.argv[1]
    if len(sys.argv) >= 2:
        if filename.endswith('.txt'):
            if flag == '--email' or '--chat':
                text_module_main(filename)
            else:
                print("Usage: python modules.py --[chat/email] <filename.txt>")
                exit
        #else:
        #    if filename.endswith('.wav'):
        #        speech_module(filename)
        #    else:
        #        print("Usage: python modules.py --audio <filename.wav>")
        #        break
    else:
        print("Usage: python modules.py --[chat/email/audio] <filename.[txt/wav]>")
        exit
        


