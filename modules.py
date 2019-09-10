import re
import json

def levenshtein(s1, s2):
    if len(s1) < len(s2):
        return levenshtein(s2, s1)

    # len(s1) >= len(s2)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1 # j+1 instead of j since previous_row and current_row are one character longer
            deletions = current_row[j] + 1       # than s2
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]


with open('cases.json', 'r') as JSON:
    caseList = json.load(JSON)

print(json.dumps(caseList))
probCases = []

f = open("sample-dispute-1.txt", "r")
f_text = f.read()
f.close()
for x in caseList.values():
    temp = ''
    for e in x["Keywords"]:
        temp += str(e) + '|'
    temp = temp[:len(temp)-1]
    re_pattern = r'\b(?:{})'.format(temp)
    match = re.findall(re_pattern, f_text)
    #match = list(set(match))
    print(match)
    print(x["Keywords"])
    prob = round(len(match)/len(x["Keywords"]),2)
    probCases.append(prob)

print(probCases)

final = []
f = open("sample-dispute-1.txt", "r")
for line in f:
    match = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', line)
    if len(match) != 0:
        for x in match:
            final.append(x)

f.close()

final = list(set(final))
for e in final:
    if e.endswith('gmail.com') or e.endswith('yahoo.com') or e.endswith('outlook.com'):
        customer_email = e
        break

with open('data.json', 'r') as JSON:
    cList = json.load(JSON)

customer_email = "sarthak@gmail.com"
for x in cList.values():
    if x["Email"] == customer_email:
        reqd_accno = x["AcctNo"]
        break

print(customer_email)
print(reqd_accno)
print(json.dumps(cList))