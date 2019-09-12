from textblob import TextBlob
text = '''
'hi my name is Mark my account number is four 123456789 registered mobile number is 98102 21311 I would like to raise a dispute I had booked a flight from Delhi to Ho Chi minh city on 24th October why am I X Y Z credit card through MakeMyTrip the flight had got cancelled and I would like to have a chargeback initiated for the same I would like to generate a dispute On The Merchant and request for a chargeback on my account thank you'
'''

text1 = ' i am happy with your service'
text2 = 'i am not happy with your service'
blob = TextBlob(text)
#blob.tags
sentiment = blob.sentiment
print(sentiment.polarity)
#if polarity > 0: positive
##<0 : negative
##kuch nahi bol sakte, ye sirf khanooja ko "pata hai".
