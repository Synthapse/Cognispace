from cassandra.cluster import Cluster

if __name__ == "__main__":
    
    cluster = Cluster(['0.0.0.0'],port=9042)
    session = cluster.connect('NutriInsight',wait_for_all_pools=True)
    rows = session.execute('SELECT * FROM recipes')
    for row in rows:
        print(row.name,row.description,row.minutes)
        