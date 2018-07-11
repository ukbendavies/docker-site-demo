# docker-site-demo

## Synopsis

Demonstration of a mkdocs site published to Azure AKS as a Docker image using a small nginx linux image as a base.

## Description

I created this repo to assist my understanding of potential workflows for linux based Docker images and hosting options such as Microsoft Azure Managed Kubernettes (AKS).

MkDocs and nginx were chosen as reasonable examples of a minimalist stack that runs within a Docker container.

The documents herein aims to cover core research topics and will hopefully help others exploring these topics. The example MkDocs site is available using GitHub Pages so that viewers can gain a flavour of what the running container would look like if the docs are followed. GitHub Pages is used to avoid on-going costs involved in Kubernetes container hosting for this non-production workload.

To assist learning, some factors are intentionally ignored such as official mkdocs docker images and the fact that mkdocs can host directly on GitHub pages, and other such facts.

## Attributions

