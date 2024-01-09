uvicorn main:app --reload
or
python -m uvicorn main:app  --reload

LangChain + LLama2

https://medium.com/@murtuza753/using-llama-2-0-faiss-and-langchain-for-question-answering-on-your-own-data-682241488476


____

huggingface-cli login
____

Getting large file from repository:

Note:
There is issue that CI / CD process not save git lfs files.

git lfs fetch --all
____

DB: Cassandra:

https://blog.adnansiddiqi.me/getting-started-with-apache-cassandra-and-python/

View status of container:

-- docker exec -it cas1 nodetool statu

-- docker inspect {name of container}
-- docker inspect <containerNameOrId> | grep '"IPAddress"' | head -n 1

Connect to 2-nd node:

-- docker exec -it cas2  cqlsh

(it is similar to MySQL shell.)