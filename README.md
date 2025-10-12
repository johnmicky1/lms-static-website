# 🚀 Automating Static Website Deployment to AWS S3 Using GitHub and Jenkins

This documentation provides a **step-by-step guide** to automate the deployment of a static website to **Amazon S3** using **GitHub** and **Jenkins**. 
The pipeline ensures continuous integration and delivery (CI/CD) — every code update in GitHub is automatically built and deployed to the S3 bucket.

---

## 🧩 Architecture Overview

**Workflow Summary:**
1. Developer pushes website code to GitHub.
2. Jenkins pulls the latest code.
3. Jenkins uploads files to S3.
4. AWS S3 hosts and serves the website publicly.

**Tools Used:**
- Amazon S3 → Static website hosting  
- GitHub → Source code management  
- Jenkins → CI/CD automation  
- AWS CLI → Command-line interface  

---

## 🪣 Step 1: Set Up AWS S3 Bucket

### 1. Create an S3 Bucket
- Log in to **AWS Console** → S3 → **Create bucket**
- Enter a **unique bucket name**, e.g., `my-static-website-bucket`
- Choose a region (e.g., `us-east-1`)

> ⚠️ Bucket names must be globally unique.

### 2. Configure Bucket Settings
- Disable “Block Public Access”
- Enable ACLs for public content access
- Enable **Static Website Hosting**
  - Index document: `index.html`
  - Error document: `error.html`

### 3. Add a Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::my-static-website-bucket/*"
  }]
}
```

### 4. (Optional) Upload Initial Files
```bash
aws s3 cp index.html s3://my-static-website-bucket/ --acl public-read
```

---

## 💻 Step 2: Configure GitHub and Jenkins

### 1. Set Up GitHub Repository
```bash
git clone https://github.com/<username>/static-website.git
cd static-website
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Install Jenkins on AWS EC2
```bash
sudo apt update -y
sudo apt install openjdk-17-jdk -y
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list
sudo apt update -y
sudo apt install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

Access Jenkins at:  
`http://<EC2-Public-IP>:8080`

Retrieve the admin password:  
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### 3. Add AWS Credentials in Jenkins
- Go to **Manage Jenkins → Credentials → Global → Add Credentials**
- Type: **AWS Credentials**
- Input **Access Key ID** and **Secret Access Key**

### 4. Connect Jenkins to GitHub
- Install **GitHub Plugin**
- Under **Source Code Management**, select **Git**
- Add repository URL: `https://github.com/<username>/static-website.git`
- Enable trigger: “GitHub hook trigger for GITScm polling”

---

## ⚙️ Step 3: Deploy to S3 Using Jenkins

### 1. Create Jenkins Job
- Click **New Item → Freestyle Project**
- Name it: `Deploy-to-S3`

### 2. Configure Build Step
Add an **Execute Shell** step:

```bash
#!/bin/bash
echo "Starting deployment to S3..."
aws s3 sync . s3://my-static-website-bucket/ --delete --acl public-read
echo "Deployment complete."
```

### 3. Build the Job
Click **Build Now** → Monitor logs → Verify success.

---

## 🌐 Step 4: Access Your Website

Access your website at:

```
http://<bucket-name>.s3-website-<region>.amazonaws.com
```

Example:

```
http://my-static-website-bucket.s3-website-us-east-1.amazonaws.com
```

---

## 🧹 Optional: Clean Up Resources

```bash
aws s3 rm s3://my-static-website-bucket --recursive
aws s3 rb s3://my-static-website-bucket
```

---

## ✅ Summary

| Step | Description |
|------|--------------|
| 1 | Configured S3 bucket for public static hosting |
| 2 | Linked GitHub repo to Jenkins |
| 3 | Automated deployment from Jenkins to S3 |
| 4 | Accessed website via S3 endpoint |

---

## 📘 Best Practices

- Use IAM roles instead of static credentials  
- Restrict access using CloudFront (HTTPS)  
- Enable versioning and logging  
- Use GitHub webhooks for auto-deployments  

---

> **Author:** John Michael Oliba  
> **Version:** 1.0  
> **Date:12 October 2025
