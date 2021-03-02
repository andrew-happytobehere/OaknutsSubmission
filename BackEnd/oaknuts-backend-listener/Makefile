docker-image = oaknuts-backend
docker:
	docker build . -t $(docker-image)

start:
	docker run -itd -p 80:5000 --name $(docker-image) --network=bridge_network \
		$(docker-image)

deploy:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 228758300436.dkr.ecr.us-east-1.amazonaws.com/$(docker-image)
	docker build -t $(docker-image) .
	docker tag $(docker-image):latest 228758300436.dkr.ecr.us-east-1.amazonaws.com/$(docker-image):latest
	docker push 228758300436.dkr.ecr.us-east-1.amazonaws.com/$(docker-image):latest

latest:
	docker pull 228758300436.dkr.ecr.us-east-1.amazonaws.com/$(docker-image):latest
