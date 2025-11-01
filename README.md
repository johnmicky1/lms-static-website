I apologize for the error. Since I cannot directly access a `file_manager:upload` tool, I will provide the content as a markdown-formatted text block, which you can easily copy and save as a `.md` file.

Here is the markdown file content for the edited **CI/CD Pipeline Setup** guide:

````markdown
## CI/CD Pipeline Setup: IAM, EC2, S3, GitHub, and Jenkins Integration

### Objective
To set up a complete **Continuous Integration/Continuous Deployment (CI/CD)** pipeline that automatically **builds and deploys a static website** from **GitHub** to **Amazon S3**, using **Jenkins** running on an **EC2** instance.

### Flow Diagram



Source: [create-flow-diagram-with-image](https://www.perplexity.ai/search/create-flow-diagram-with-image-SlKuRsZcRBebm1SvWB9YRA?0=i)

---

## 1. AWS IAM Configuration

### 1.1 Create an IAM User or Role for Jenkins

**Purpose:** Grant permissions for **EC2**, **S3**, and **CloudWatch** integration.

**Required Policies (Attach Directly):**
* `AmazonS3FullAccess`
* `AmazonEC2FullAccess`
* `CloudWatchLogsFullAccess`
* *(Optional for full control):* `AdministratorAccess`

### Create Access Key and Secret Access Key

1.  Log in to the **AWS Management Console** and navigate to the **IAM** dashboard.
2.  In the left sidebar, select **Users** and click **Create user**.
3.  Specify a user name (e.g., **Jenkins-EC2**) and click **Next**.
4.  For permissions, select **Attach policies directly**.
5.  Search for and select the required policies (e.g., `AdministratorAccess`, `AmazonS3FullAccess`, `AmazonEC2FullAccess`, `CloudWatchLogsFullAccess`). Click **Next**.
6.  Review the summary and click **Create user**.
7.  Click the new user (**Jenkins-EC2**) and go to **Security Credentials**.
8.  Scroll down to **Access keys** and click **Create Access Key**.
9.  Select **Command Line Interface (CLI)**, check the acknowledgment box, and click **Next**.
10. *(Optional):* Set a description tag (e.g., `Jenkin-EC2-Access`). Click **Create Access Key**.
11. **Save the Access Key** and **Secret Access Key** immediately in a secure location (e.g., a secured local file or a password manager), as you will need them for Jenkins and local AWS CLI setup.
12. **Download the CSV file** as a secure backup and save it in a secure location.

---

## 2. Set Up AWS S3 Bucket 💻

### 2.1 Create an S3 Bucket

1.  Log in to the AWS Management Console and navigate to **S3**.
2.  Click **Create bucket**.
3.  Enter a **unique bucket name** (e.g., `my-static-website-bucket-jmo-2025`). *Bucket names must be globally unique.*
4.  Choose your preferred **AWS Region**.

### Configure Bucket Settings for Static Hosting

1.  **Disable "Block Public Access"**:
    * Scroll down to the "Block Public Access" section.
    * **Uncheck** `Block all public access`.
    * Confirm the acknowledgment that your bucket will be public.
2.  **Enable Object Ownership**:
    * Under **Object Ownership**, select **ACLs enabled**.
    * Choose **Bucket owner preferred**.
3.  Click **Create Bucket**.

### Enable Static Website Hosting

1.  Click on the newly created **Bucket**.
2.  Go to the **Properties** tab.
3.  Scroll down to **Static website hosting** and click **Edit**.
4.  Select **Enable** and choose **Host a static website**.
5.  Enter:
    * **Index document:** `index.html`
    * **Error document:** `error.html`
6.  **Save changes**. *Note the **Endpoint URL**—this is your website's URL.*

### Set Bucket Policy for Public Access

1.  Go to the **Permissions** tab of your bucket.
2.  Click **Edit** next to the **Bucket Policy**.
3.  Use the AWS **Policy Generator** to create a public read policy:
    * **Type of policy:** `S3 Bucket Policy`
    * **Principal:** `*` (for public access)
    * **Action:** `GetObject`
    * **ARN:** Copy your bucket's ARN (e.g., `arn:aws:s3:::my-static-website-bucket-jmo-2025`) and append `/*` to the end (e.g., `arn:aws:s3:::my-static-website-bucket-jmo-2025/*`).
4.  Click **Add Statement**, then **Generate Policy**.
5.  Copy the generated JSON policy, paste it into the **Bucket Policy** editor, and **Save changes**.

### Upload a Test Folder (Optional)

*This step is typically for testing before the pipeline is complete, but the guide includes it.*

1.  In the **Objects** tab, click **Upload**.
2.  Click **Add Folder**, navigate to your static website folder (e.g., containing `html`, `css`, and `js` files), and upload it.
3.  Access the website using the **Object URL** of your `index.html` file (e.g., `https://my-static-website-bucket-jmo-2025.s3.us-east-1.amazonaws.com/Capstone-Project-LMS/index.html`).

---

## 3. GitHub Setup ⚙️

1.  Log in to **GitHub** and click **New Repository**.
2.  Name it (e.g., `lms-static-website`).
3.  Initialize with a **README**.
4.  Click **Create Repository**.

### Local Setup (Simulating Developer Environment)

1.  **Clone the repo locally:**
    ```bash
    git clone git@github.com:johnmicky1/lms-static-website.git
    ```
2.  **Navigate to the directory and open your code editor (e.g., VS Code):**
    ```bash
    cd lms-static-website
    code .
    ```
3.  Add your static website files (`index.html`, `css`, `js`, etc.).
4.  **Commit and push the files:**
    ```bash
    git add .
    git commit -m "Added Static Webfiles"
    git push
    ```

---

## 4. EC2 Setup (for Jenkins)

### 4.1 Launch EC2 Instance

1.  Give the instance a name (e.g., **jenkins-ec2**).
2.  Select an **Ubuntu** Image.
3.  **Create a Key Pair:** Give it a name (e.g., `jenkins-key`) and save the downloaded `.pem` file securely.
4.  Under **Network Settings**, click **Edit**.

### Configure Security Group (Inbound Rules)

1.  Add the following rules:
    * **SSH** (TCP 22): Source `My IP` or `0.0.0.0/0`
    * **HTTP** (TCP 80): Source `0.0.0.0/0`
    * **Jenkins** (TCP 8080): Source `My IP` or your specific IP range (recommended for security)
2.  Launch the instance and wait until it is running.

### 4.2 Connect via SSH

1.  Select the instance, click **Connect**, and use the **SSH Client** tab to find the connection command.
2.  From your local terminal, use the `.pem` file to connect:
    ```bash
    ssh -i "path/to/jenkins-key.pem" ubuntu@<your-ec2-public-ip>
    ```

### Install Git on EC2 Instance

1.  Update the package index:
    ```bash
    sudo apt update
    ```
2.  Install Git:
    ```bash
    sudo apt install git -y
    ```
3.  Verify:
    ```bash
    git --version
    ```

### Configure Git with GitHub via SSH

1.  Generate a new SSH key pair:
    ```bash
    mkdir ~/.ssh
    ssh-keygen -t rsa -b 4096
    ```
    * Press **Enter** for the default file path.
    * Enter a **unique passphrase** when prompted and store it securely.
2.  Display the public key:
    ```bash
    cat ~/.ssh/id_rsa.pub
    ```
3.  **Add SSH key to GitHub:**
    * Copy the output from the `cat` command.
    * Log in to **GitHub** and go to **Settings > SSH and GPG keys**.
    * Click **New SSH key**, give it a label (e.g., "EC2 instance"), paste the key, and click **Add SSH key**.
4.  **Configure Git User Details:**
    ```bash
    git config --global user.name "Your GitHub Username"
    git config --global user.email "your_email@example.com"
    ```
5.  **Test the connection:**
    ```bash
    ssh -T git@github.com
    ```
    * *You should see a successful authentication message.*

---

## 5. Install Jenkins and Java (JDK)

### Install Java (Jenkins Requirement)

1.  Update and upgrade packages:
    ```bash
    sudo apt update -y && sudo apt upgrade -y
    ```
2.  Install OpenJDK 17:
    ```bash
    sudo apt install openjdk-17-jdk -y
    ```

### Install Jenkins

1.  Download and add the Jenkins GPG key:
    ```bash
    curl -fsSL [https://pkg.jenkins.io/debian/jenkins.io-2023.key](https://pkg.jenkins.io/debian/jenkins.io-2023.key) | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
    ```
2.  Add the Jenkins repository to your sources list:
    ```bash
    echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] [https://pkg.jenkins.io/debian-stable](https://pkg.jenkins.io/debian-stable) binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
    ```
3.  Update package list and install Jenkins:
    ```bash
    sudo apt update
    sudo apt install jenkins
    ```

### Manage Jenkins Service

1.  Start Jenkins:
    ```bash
    sudo systemctl start jenkins
    ```
2.  Enable Jenkins to start at boot:
    ```bash
    sudo systemctl enable jenkins
    ```

### Unlock Jenkins & Initial Setup

1.  Open your browser and navigate to: `http://<EC2-Public-IP-Address>:8080`
2.  In the SSH session, retrieve the initial admin password:
    ```bash
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    ```
3.  Paste the password into the browser to unlock Jenkins.
4.  Click **Install suggested plugins**.
5.  **Create Admin User** and complete the setup.
6.  Ensure the following key plugins are installed: **Git**, **Pipeline**, **AWS Steps** / **AWS Credentials**, **GitHub Integration**.

---

## 6. Configure Jenkins

### Configure Tools (JDK and Git)

1.  Go to **Manage Jenkins** → **Tools**.
2.  **Add JDK:**
    * Use the following command in SSH to find the Java path:
        ```bash
        readlink -f /usr/bin/java | sed 's/bin\/java//g'
        ```
    * Paste the path (e.g., `/usr/lib/jvm/java-17-openjdk-amd64/`) into the JDK configuration section in Jenkins.
3.  **Add Git:**
    * Use the following command in SSH to find the Git path:
        ```bash
        readlink -f $(which git) | sed 's/bin\/git//g'
        ```
    * Paste the path into the Git configuration section in Jenkins.
4.  Click **Save**.

### Add AWS Credentials to Jenkins

1.  Go to **Manage Jenkins** → **Manage Credentials** → **Global** → **Add Credentials**.
2.  **Kind:** **Username with password** (This is a common method if the AWS Credentials Plugin isn't used, but an **AWS Credentials** type is better if the plugin is installed).
    * **Username:** Your **AWS Access Key**
    * **Password:** Your **AWS Secret Access Key**
    * **ID:** `aws-jenkins-creds` (or a similar identifier)
3.  Click **Create**.

### Create GitHub Personal Access Token (PAT)

1.  In **GitHub** → **Settings** → **Developer Settings** → **Personal Access Tokens** → **Tokens (Classic)**.
2.  Generate a token with at least **`repo`** and **`admin:repo_hook`** permissions.
3.  **Copy the token** immediately and securely.

### Add GitHub Credentials in Jenkins

1.  Go to **Manage Jenkins** → **Credentials** → **System** → **Global credentials** → **Add Credentials**.
2.  **Kind:** **Username with password**
    * **Username:** Your **GitHub Username**
    * **Password:** Paste the **GitHub Personal Access Token (PAT)**
    * **ID:** `github-access-token`
3.  Click **Create**.

### Configure GitHub Webhook

1.  Go to your **GitHub repository** → **Settings** → **Webhooks** → **Add Webhook**.
2.  **Payload URL:** Enter your Jenkins URL followed by `/github-webhook/`.
    * Example: `http://<EC2-Public-IP-Address>:8080/github-webhook/`
3.  **Content type:** `application/json`
4.  **Which events would you like to trigger this webhook?** Select **Just the push event**.
5.  Click **Add webhook**.

---

## 7. Test CLI on Local Machine (Optional Pre-check)

1.  Open **Powershell/Terminal** and run:
    ```bash
    aws configure
    ```
2.  Enter the **Access Key**, **Secret Access Key**, default region, and output format.
3.  Verify the setup by listing your S3 buckets:
    ```bash
    aws s3 ls
    ```

---

## 8. Test the Pipeline

### Create a Jenkins Project

1.  Log in to your Jenkins instance.
2.  Click **New Item** → **Test-Project** → **Freestyle Project** → **OK**.

### Configure the GitHub Repository

1.  In the project configuration, scroll to **Source Code Management**.
2.  Select **Git**.
3.  **Repository URL:** Enter your GitHub repository SSH URL (e.g., `git@github.com:johnmicky1/lms-static-website.git`).
4.  **Credentials:** Select the SSH key credential you set up for the EC2 instance (or the GitHub token credential if using HTTPS).
5.  **Branches to build:** Change it to `main` (or your default branch).

### Configure the Build Trigger

1.  Scroll down to the **Build Triggers** section.
2.  Check **GitHub hook trigger for GITScm polling**.

### Configure the Build Step (Deployment)

1.  Scroll down to the **Build** section and click **Add build step** → **Execute shell**.
2.  Paste the deployment script:
    ```bash
    # Navigate to the repository directory (after checkout)
    # The workspace path is typically jenkins_home/workspace/Test-Project
    
    # Sync the repository with the S3 bucket
    # Note: Ensure the Jenkins user has the necessary AWS CLI installed and configured
    aws s3 sync . s3://my-static-website-bucket-jmo-2025 --delete
    
    # List the contents of the S3 bucket to confirm deployment
    aws s3 ls s3://my-static-website-bucket-jmo-2025
    
    echo "Deployment to S3 complete."
    ```
3.  Click **Save**.
4.  Click **Build Now** to trigger the first manual build.

### Verify the Build Trigger

1.  Make a small change to a file (e.g., `index.html`) in your **local cloned repository**.
2.  **Commit and push** the changes to GitHub.
3.  Go back to your Jenkins project's **Build History**. You should see a new build triggered automatically by the GitHub webhook, confirming the connection is working.
4.  Confirm the change is live at your S3 static website endpoint.

---

## Clean Up

To avoid unnecessary costs, remember to **delete all resources** after completing the testing:

* **EC2 Instance:** Terminate the EC2 instance.
* **S3 Bucket:** Delete all objects, then delete the bucket itself.
* **IAM User/Policies:** Delete the IAM user and any custom policies created.
* **GitHub Token/Webhook:** Delete the Personal Access Token and the Webhook.

---

## 📘 Author Information

* **Prepared by:** John Michael Oliba
* **Passionate about:** DevOps, Systems Engineering, Administration, Graphics Design, Accounts & Finance
* **Date:** November 01, 2025
* **Version:** 1.0
````

You can copy the text above and save it as a file named `CI-CD Pipeline Setup.md`.
