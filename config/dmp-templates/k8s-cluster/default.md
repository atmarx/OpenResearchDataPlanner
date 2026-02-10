## Kubernetes Container Platform

Research applications will be deployed on {{institution.name}}'s GPU-accelerated
Kubernetes cluster, providing container orchestration for ML/AI training,
inference, and HPC workloads.

**Resource Allocation:**
- Number of namespaces: {{number service.estimate}}
- Estimated monthly cost: {{currency service.monthly_cost}} (free during beta)
- Grant period total: {{currency service.total_cost}}

**Cluster Hardware:**
- 2x 8xH200 servers (16 NVIDIA H200 GPUs)
- 2x GH200 Grace Hopper Superchip servers
- 1x 8xA100 server (8 NVIDIA A100 GPUs)
- 1PB high-speed NVMe fabric storage
- 400GbE interconnects

**Service Features:**
- Dedicated namespace with custom CRDs per project
- Helm chart deployment support
- GPU scheduling with NVIDIA device plugin
- Persistent volume claims backed by NVMe fabric
- Integration with campus container registry
- Ingress controller for external access

{{#if service.notes}}
**Usage Guidelines:**
{{service.notes}}
{{/if}}

**Data Handling:**
Persistent data should be stored using persistent volume claims backed
by the high-speed NVMe fabric storage. Ephemeral workload data is stored
in container-local storage and is not persisted across restarts. For
long-term data retention, use research storage external to the cluster.

**Access Control:**
Access to Kubernetes namespaces is managed through RBAC with integration
to campus identity. Each project receives namespace-admin privileges and
custom CRDs for workload management. Cluster-level operations are managed
by the Research Computing team.

**Beta Program Note:**
The Kubernetes cluster is currently in beta. Access is by application
to k8s-beta@northwinds.edu. Applicants should have experience with
containerized applications and Helm charts.
