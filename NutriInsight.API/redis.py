import redis
 
r = redis.Redis(host='localhost', port=6379, db=0, protocol=3)

r.set('key', 'value')
data = r.get('key')
print(data)