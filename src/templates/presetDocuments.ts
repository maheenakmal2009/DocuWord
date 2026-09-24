import { DocumentTemplate } from '../types/document';

export const PRESET_DOCUMENTS: DocumentTemplate[] = [
  {
    id: 'proposal',
    title: 'Executive Project Proposal',
    category: 'Business',
    badge: 'Popular',
    description: 'A comprehensive project proposal with executive summary, problem statement, solution matrix, budget table, and sign-offs.',
    content: `
      <h1 style="color: #1e3a8a; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Project Apex: Enterprise Workflow Modernization</h1>
      <p style="color: #64748b; font-size: 0.95rem; margin-top: -4px;">Prepared for: Executive Leadership Team &bull; Date: October 2026 &bull; Status: Formal Proposal</p>
      
      <div class="callout-box">
        <strong>Executive Summary:</strong> Project Apex is a strategic initiative designed to automate core business operations, unify disparate communications, and accelerate product velocity by 35% within the first 6 months of rollout.
      </div>

      <h2>1. Problem Statement & Market Context</h2>
      <p>Our current operational infrastructure relies on fragmented software silos, resulting in manual data reconciliations, delayed client deliverables, and an estimated 18 hours per employee spent on administrative overhead each week.</p>
      
      <ul>
        <li><strong>Redundant Tooling:</strong> Over 12 isolated SaaS platforms without bidirectional synchronization.</li>
        <li><strong>Data Latency:</strong> Executive KPI reports lag behind actual ground execution by 72 hours.</li>
        <li><strong>Scalability Bottlenecks:</strong> Current throughput caps out at 15,000 monthly transactions before service degradation occurs.</li>
      </ul>

      <h2>2. Proposed Architecture & Solution</h2>
      <p>By standardizing on a unified cloud-native architecture, Project Apex consolidates transactional tracking, real-time analytics, and automated notification loops into a cohesive, fault-tolerant platform.</p>

      <table class="tbl-style-blue">
        <thead>
          <tr>
            <th>Milestone Phase</th>
            <th>Core Deliverable</th>
            <th>Target Completion</th>
            <th>Lead Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phase 1: Discovery</td>
            <td>Architecture audit & schema consolidation</td>
            <td>Month 1</td>
            <td>Engineering Team</td>
          </tr>
          <tr>
            <td>Phase 2: Core Platform</td>
            <td>API gateway & database normalization</td>
            <td>Month 3</td>
            <td>Cloud Infrastructure</td>
          </tr>
          <tr>
            <td>Phase 3: Migration</td>
            <td>Zero-downtime cutover & team training</td>
            <td>Month 5</td>
            <td>Product & DevOps</td>
          </tr>
          <tr>
            <td>Phase 4: Optimization</td>
            <td>Performance tuning & executive dashboards</td>
            <td>Month 6</td>
            <td>Analytics Directorate</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Budget Allocation & Financial Projection</h2>
      <p>The total investment for Project Apex is structured across personnel, infrastructure, and compliance contingencies:</p>

      <table class="tbl-style-blue">
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Q1 - Q2 Estimate</th>
            <th>Projected ROI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Software Engineering</td>
            <td>Dedicated sprint team of 6 engineers</td>
            <td>$180,000</td>
            <td>Permanent tooling ownership</td>
          </tr>
          <tr>
            <td>Cloud Infrastructure</td>
            <td>High-availability multi-region cluster</td>
            <td>$35,000</td>
            <td>99.99% uptime guarantee</td>
          </tr>
          <tr>
            <td>Security & Audit</td>
            <td>Third-party penetration testing & SOC 2</td>
            <td>$25,000</td>
            <td>Enterprise compliance ready</td>
          </tr>
          <tr>
            <td><strong>Total Allocated</strong></td>
            <td><strong>Comprehensive Initial CapEx</strong></td>
            <td><strong>$240,000</strong></td>
            <td><strong>Estimated $420,000 saved/yr</strong></td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>4. Approvals & Signatures</h2>
      <p>By signing below, the executive stakeholders authorize the budget and operational mandate to initiate Phase 1 immediately:</p>
      
      <table style="border: none; margin-top: 24px;">
        <tr style="border: none;">
          <td style="border: none; width: 50%; padding-right: 20px;">
            <p><strong>Chief Technology Officer:</strong></p>
            <p style="border-bottom: 1px solid #94a3b8; height: 35px;"></p>
            <p style="font-size: 0.85rem; color: #64748b;">Signature / Date</p>
          </td>
          <td style="border: none; width: 50%; padding-left: 20px;">
            <p><strong>Chief Financial Officer:</strong></p>
            <p style="border-bottom: 1px solid #94a3b8; height: 35px;"></p>
            <p style="font-size: 0.85rem; color: #64748b;">Signature / Date</p>
          </td>
        </tr>
      </table>
    `.trim()
  },
  {
    id: 'resume',
    title: 'Professional Executive Resume',
    category: 'Career',
    description: 'Clean, elegant executive resume tailored for senior leadership, tech architects, and product managers.',
    content: `
      <h1 style="margin-bottom: 4px; color: #0f172a;">Alexandra Vance</h1>
      <p style="color: #2563eb; font-weight: 600; font-size: 1.1rem; margin-top: 0; margin-bottom: 8px;">Principal Software Architect &amp; Engineering Leader</p>
      <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 16px;">
        San Francisco, CA &bull; alexandra.vance@example.com &bull; (555) 392-1084 &bull; linkedin.com/in/alexandravance
      </p>

      <hr />

      <h2>Executive Profile</h2>
      <p>Results-driven Principal Software Architect with 12+ years of experience leading high-scale distributed systems and enterprise cloud modernization. Proven track record of scaling consumer platforms from 100K to 40M active users while maintaining 99.995% service availability.</p>

      <h2>Core Competencies</h2>
      <table>
        <tbody>
          <tr>
            <td style="width: 33%; font-weight: 600;">Distributed Architecture</td>
            <td style="width: 33%; font-weight: 600;">Cloud Infrastructure (AWS/GCP)</td>
            <td style="width: 33%; font-weight: 600;">Technical Team Mentorship</td>
          </tr>
          <tr>
            <td>High-Throughput Microservices</td>
            <td>Database Optimization &amp; Sharding</td>
            <td>CI/CD &amp; Zero-Downtime Deployment</td>
          </tr>
        </tbody>
      </table>

      <h2>Professional Experience</h2>
      
      <h3 style="margin-bottom: 2px;">Principal Architect &bull; Horizon Cloud Systems</h3>
      <p style="color: #64748b; font-size: 0.85rem; margin-top: 0; margin-bottom: 8px;">2022 &ndash; Present &bull; San Francisco, CA</p>
      <ul>
        <li>Architected global event-streaming backbone handling 4.2 billion daily events with sub-50ms p99 latency.</li>
        <li>Reduced cloud infrastructure operational expenditures by 28% ($1.2M annually) via predictive auto-scaling.</li>
        <li>Spearheaded engineering best practices, leading architectural review boards for 8 cross-functional teams.</li>
      </ul>

      <h3 style="margin-bottom: 2px;">Senior Staff Engineer &bull; Vector Dynamics</h3>
      <p style="color: #64748b; font-size: 0.85rem; margin-top: 0; margin-bottom: 8px;">2018 &ndash; 2022 &bull; Seattle, WA</p>
      <ul>
        <li>Led the complete migration from monolithic legacy framework to containerized Kubernetes microservices.</li>
        <li>Authored foundational developer tooling and SDKs adopted across 140+ internal engineering contributors.</li>
      </ul>

      <h2>Education &amp; Credentials</h2>
      <ul>
        <li><strong>B.S. in Computer Science</strong> &ndash; University of California, Berkeley (Summa Cum Laude)</li>
        <li><strong>AWS Certified Solutions Architect &ndash; Professional</strong> (Issued 2024)</li>
      </ul>
    `.trim()
  },
  {
    id: 'report',
    title: 'Scientific Research Report',
    category: 'Academic',
    description: 'Academic paper format with abstract, methodology, statistical table, findings, and bibliography citations.',
    content: `
      <h1 style="text-align: center; color: #0f172a; margin-bottom: 8px;">Comparative Latency Analysis in Modern Distributed Consensus Protocols</h1>
      <p style="text-align: center; color: #475569; font-size: 0.95rem; margin-top: 0;">
        Dr. Marcus Sterling, PhD &bull; Department of Computational Systems &bull; Cambridge University
      </p>

      <blockquote style="margin: 20px 0; background-color: #f8fafc; border-left: 4px solid #475569;">
        <strong>Abstract:</strong> This paper investigates transaction finality latencies across three state-of-the-art distributed consensus protocols under varying network partitions and Byzantine fault thresholds. Empirical benchmarks demonstrate that protocol variant Alpha achieves 42% lower tail latencies during cross-continental synchronization compared to classical Paxos variants.
      </blockquote>

      <h2>1. Introduction &amp; Problem Scope</h2>
      <p>Modern cloud environments necessitate consensus mechanisms that remain deterministic despite unpredictable packet jitter, dynamic network partitions, and node churn. While classical quorum approaches guarantee safety, their communication complexity frequently compounds latency under elevated node counts.</p>

      <h2>2. Benchmark Methodology</h2>
      <p>We simulated a geographically dispersed cluster of 64 nodes distributed across 8 global data centers. Synthetic workloads were injected at rates ranging from 1,000 to 50,000 transactions per second (TPS).</p>

      <table class="tbl-style-slate">
        <thead>
          <tr>
            <th>Protocol Model</th>
            <th>Throughput (TPS)</th>
            <th>Median Latency (ms)</th>
            <th>p99 Latency (ms)</th>
            <th>Fault Tolerance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Protocol Alpha (Hybrid)</td>
            <td>48,200</td>
            <td>18.4</td>
            <td>42.1</td>
            <td>Optimal (f &lt; n/3)</td>
          </tr>
          <tr>
            <td>Standard Raft</td>
            <td>31,500</td>
            <td>29.2</td>
            <td>84.6</td>
            <td>Standard (f &lt; n/2)</td>
          </tr>
          <tr>
            <td>Byzantine Paxos</td>
            <td>24,100</td>
            <td>41.8</td>
            <td>112.5</td>
            <td>Optimal (f &lt; n/3)</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Discussion &amp; Conclusion</h2>
      <p>The collected empirical evidence confirms that decoupling proposal aggregation from commit verification significantly diminishes round-trip penalties across long-haul fiber links.</p>

      <hr />

      <h2>References Cited</h2>
      <ol style="font-size: 0.85rem; color: #475569;">
        <li>Lamport, L. (1998). "The Part-Time Parliament". ACM Transactions on Computer Systems.</li>
        <li>Ongaro, D., &amp; Ousterhout, J. (2014). "In Search of an Understandable Consensus Algorithm". USENIX ATC.</li>
        <li>Sterling, M. (2025). "Asynchronous Fault Tolerance in Geo-Replicated Topologies". Journal of Distributed Systems.</li>
      </ol>
    `.trim()
  },
  {
    id: 'minutes',
    title: 'Executive Meeting Minutes',
    category: 'Business',
    description: 'Structured meeting record with attendees, agenda items, key deliberations, and clear action item matrix.',
    content: `
      <h1 style="color: #1e3a8a; margin-bottom: 4px;">Executive Board Meeting Minutes</h1>
      <p style="color: #64748b; font-size: 0.9rem; margin-top: 0;">Date: October 24, 2026 &bull; Time: 10:00 AM &ndash; 11:30 AM PST &bull; Location: Conference Room Alpha &amp; Hybrid Video</p>

      <h2>1. Attendees &amp; Quorum</h2>
      <table class="tbl-style-emerald">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Attendance Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Elena Rostova</td>
            <td>Chief Executive Officer</td>
            <td>Present (Chair)</td>
          </tr>
          <tr>
            <td>David Chen</td>
            <td>Chief Technology Officer</td>
            <td>Present</td>
          </tr>
          <tr>
            <td>Sarah Jenkins</td>
            <td>VP of Product Operations</td>
            <td>Present (Virtual)</td>
          </tr>
          <tr>
            <td>Robert Martinez</td>
            <td>Head of Financial Compliance</td>
            <td>Present</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Agenda Deliberations</h2>
      <h3>Item A: Annual Infrastructure Expansion Review</h3>
      <p>David Chen presented the updated capacity forecast for Q1 2027. Infrastructure demand is projected to rise by 40% due to enterprise onboarding in APAC. The board unanimously ratified the proposal to expand cluster capacity in Tokyo and Singapore.</p>

      <h3>Item B: Information Security &amp; SOC 2 Type II Recertification</h3>
      <p>Robert Martinez confirmed that all compliance controls passed external audit with zero non-conformities reported. Final certification documents will be distributed to enterprise customers by month-end.</p>

      <h2>3. Action Item Matrix</h2>
      <table class="tbl-style-emerald">
        <thead>
          <tr>
            <th>Action Task</th>
            <th>Assigned Owner</th>
            <th>Target Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Finalize vendor SLA contracts for APAC datacenter</td>
            <td>David Chen</td>
            <td>November 15, 2026</td>
            <td>In Progress</td>
          </tr>
          <tr>
            <td>Distribute SOC 2 certification pack to tier-1 clients</td>
            <td>Robert Martinez</td>
            <td>November 02, 2026</td>
            <td>Ready</td>
          </tr>
          <tr>
            <td>Prepare budget forecast reconciliation for Q4 audit</td>
            <td>Finance Team</td>
            <td>November 20, 2026</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    `.trim()
  },
  {
    id: 'blank',
    title: 'Blank Document',
    category: 'General',
    description: 'A clean slate with standard margins ready for composing new articles, notes, or memos.',
    content: `
      <h1>Document Title</h1>
      <p>Start typing your content here. You can format text, add tables, insert images, customize page setup, and export to Word DOCX or PDF.</p>
    `.trim()
  }
];
