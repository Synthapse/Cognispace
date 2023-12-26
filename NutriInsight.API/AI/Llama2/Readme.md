- llama7B-2.bin (3.8GB) - is a model holding locally.

To run Llama on Kubernetes:

To containerize Llama 2, start off by creating a Truss project (https://github.com/basetenlabs/truss):
```
truss init llama2-7b
```
_____
```
docker build llama2-7b -t custom-model:latest
docker tag llama2-7b $DOCKER_USERNAME/llama2-7b
docker push $DOCKER_USERNAME/llama2-7b
```

3. Deploy Llama to GKE:

Login to gcloud:

```
gcloud auth login
```

```
gcloud config set compute/zone us-central1-c
gcloud container clusters get-credentials gpu-cluster
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/master/nvidia-driver-installer/cos/daemonset-preloaded.yaml
```
```
kubectl create -f kubernetes_deployment.yaml
kubectl get svc
```
```
curl --location 'http://$EXTERNAL_IP/v1/models/model:predict' \\
--header 'Content-Type: application/json' \\
--data '{
    "prompt": "Who was president of the united states of america in 1890?"
}'
```


Costs:

$481.76
That's about $0.66 per hour


Cluster management fee

$0.10/hour x 730 hours

$73.00
default-pool (n1-standard-4) spot nodes
4 vCPU + 15 GB memory
($29.20 x 3 nodes)

$87.60
1 nvidia-tesla-t4
($131.25 x 3 nodes)

$393.76
50 GB balanced persistent disk
($5.00 x 3 nodes)

https://cloud.google.com/kubernetes-engine/docs/how-to/cost-allocations

