# Plantilla C: Módulo Estandarizado de Infraestructura (Terraform AWS ECS Cluster)

> **Proyecto:** `{project_name}`  
> **Entorno:** `{environment}`  
> **Región:** `{aws_region}`

```hcl
# main.tf - AWS ECS Cluster Infrastructure

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "company-terraform-states"
    key            = "services/app-prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = var.project_name
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "production"
}

variable "project_name" {
  type    = string
  default = "core-platform"
}

# ECS Cluster Setup
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Capacity Provider Configuration (Fargate Auto-Scaling)
resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

output "ecs_cluster_id" {
  description = "ID del cluster ECS creado"
  value       = aws_ecs_cluster.main.id
}

output "ecs_cluster_name" {
  description = "Nombre del cluster ECS creado"
  value       = aws_ecs_cluster.main.name
}
```

---

## Checklist de validación

- [ ] `terraform fmt` sin cambios pendientes
- [ ] `terraform validate` exitoso
- [ ] Backend S3 con cifrado y bloqueo DynamoDB
- [ ] Tags `Environment`, `ManagedBy`, `Project` en recursos
- [ ] Container Insights habilitado
