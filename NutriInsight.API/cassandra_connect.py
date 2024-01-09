from cassandra.cluster import Cluster

#DB Connection to Cassandra

if __name__ == "__main__":

    cluster = Cluster(['34.32.40.250'],port=9042)
    session = cluster.connect('NutriInsight',wait_for_all_pools=True)
    rows = session.execute('SELECT * FROM recipes LIMIT 300')
    for row in rows:
        print(row.name,row.description,row.minutes)
        