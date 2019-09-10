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

customer_email = 'rohinsatija2410@gmail.com'
cList = [["Rohin Satija","rohinsatija2410@gmail.com",4617325565841234,[]],["Siddhartha Khanooja","siddhartha.khanooja@gmail.com",4617325565841235,[]]]

print(json.dumps(cList))
for x in cList:
    if x[1] == customer_email:
        reqd_accno = x[2]
        break

print(customer_email)
print(reqd_accno)