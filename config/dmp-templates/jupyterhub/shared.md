## JupyterHub (Shared)

Interactive data analysis and notebook-based workflows will utilize
{{institution.name}}'s shared JupyterHub service, providing browser-based
access to Jupyter notebooks backed by HPC compute resources.

**Resource Allocation:**
- Duration: {{number service.estimate}} months
- Cost: {{currency service.total_cost}} (no cost)

**Features:**
- Browser-based Jupyter interface
- Python, R, and Julia kernels pre-installed
- Scientific computing stack (numpy, pandas, scikit-learn, etc.)
- Jobs spawned on HPC cluster for compute
- Conda environments for custom packages
- Data stored in HPC home directory

{{#if service.notes}}
**Notes:**
{{service.notes}}
{{/if}}

**Limitations:**
- 4-hour session limit
- Shared resources; may queue during peak usage
- Not approved for L3/High tier or regulated data

**Data Storage:**
Notebooks and data are stored in the user's HPC home directory. For
persistent storage beyond HPC allocations, use Isilon HPC Storage or
other research storage options.

**Access:**
Available to all researchers with active HPC accounts. Access via
campus network or VPN at jupyterhub.northwinds.edu.
