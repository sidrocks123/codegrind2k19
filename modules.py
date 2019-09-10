import re
import json

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

#cList = [["Rohin Satija","rohinsatija2410@gmail.com",4617325565841234,[]],["Siddhartha Khanooja","siddhartha.khanooja@gmail.com",4617325565841235,[[1],[2]]]
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