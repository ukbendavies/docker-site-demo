# Deploying on Kubernetes

For this research Kubernetes declarative configuration is used to achieve a desired state rather than an imperative approach using kubectl.

!!! Example "declarative deployment"
    ``` yaml
    site_name: 'docker-site-demo'
    site_description: "Demonstration of a mkdocs site published as a docker image using a small nginx linux image as a base."
    site_author: 'https://github.com/ukbendavies'
    repo_name: 'ukbendavies/docker-site-demo'
    repo_url: 'https://github.com/ukbendavies/docker-site-demo'
    pages:
        - Introduction: index.md
        - Docker: docker.md
        - Kubernetes: kubernetes.md
    theme:
        name: 'material'
        palette:
            primary: 'red'
            accent: 'red'
        language: 'en'
        feature:
            tabs: false
    markdown_extensions:
        - admonition
        - pymdownx.superfences
        - codehilite:
            linenums: true
        - toc:
            permalink: true
    extra:
        repo_icon: 'github'
    ```