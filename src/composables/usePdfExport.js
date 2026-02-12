// Lazy-load pdfmake to avoid large bundle size
let pdfMakeInstance = null

async function getPdfMake() {
  if (!pdfMakeInstance) {
    const [pdfMake, pdfFonts] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts')
    ])
    pdfMake.default.vfs = pdfFonts.default.vfs
    pdfMakeInstance = pdfMake.default
  }
  return pdfMakeInstance
}

/**
 * Composable for generating PDF approval receipts
 */
export function usePdfExport() {
  /**
   * Generate an approval receipt PDF
   * @param {Object} plan - The plan object from workbenchStore
   * @param {Object} options - Additional options
   * @returns {Object} pdfmake document definition
   */
  function generateApprovalReceipt(plan, options = {}) {
    const data = plan.data || {}
    const slate = data.slate || {}
    const items = slate.items || []
    const now = new Date()

    // Build document definition
    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [50, 60, 50, 60],

      // Header
      header: {
        columns: [
          {
            text: 'OpenDataPlanner',
            style: 'headerText',
            margin: [50, 20, 0, 0]
          },
          {
            text: 'Approval Receipt',
            style: 'headerBadge',
            alignment: 'right',
            margin: [0, 20, 50, 0]
          }
        ]
      },

      // Footer with page numbers
      footer: function(currentPage, pageCount) {
        return {
          columns: [
            {
              text: `Generated: ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
              style: 'footerText',
              margin: [50, 0, 0, 0]
            },
            {
              text: `Page ${currentPage} of ${pageCount}`,
              alignment: 'right',
              style: 'footerText',
              margin: [0, 0, 50, 0]
            }
          ],
          margin: [0, 20, 0, 0]
        }
      },

      content: [
        // Title
        {
          text: data.project_name || 'Research Computing Request',
          style: 'title',
          margin: [0, 0, 0, 5]
        },

        // Approval Badge
        {
          table: {
            widths: ['auto'],
            body: [[{
              text: 'APPROVED',
              style: 'approvedBadge',
              margin: [10, 5, 10, 5]
            }]]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 20]
        },

        // Approval Details
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'Approved By', style: 'label' },
                { text: options.approvedBy || plan.data?.last_reviewed_by || 'Support Staff', style: 'value' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'Approval Date', style: 'label' },
                { text: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), style: 'value' }
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // Researcher Contact (if provided)
        ...(data.contact ? [{
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                { text: 'Researcher Contact', style: 'sectionHeader', margin: [0, 0, 0, 5] },
                {
                  columns: [
                    data.contact.name ? { text: data.contact.name, style: 'contactText' } : {},
                    data.contact.department ? { text: data.contact.department, style: 'contactText' } : {},
                    data.contact.email ? { text: data.contact.email, style: 'contactText', color: '#4F46E5' } : {}
                  ].filter(c => c.text)
                }
              ],
              margin: [10, 10, 10, 10]
            }]]
          },
          layout: {
            fillColor: '#F9FAFB',
            hLineWidth: () => 0,
            vLineWidth: () => 0
          },
          margin: [0, 0, 0, 20]
        }] : []),

        // Tier Classification (if present)
        ...(data.tier_name ? [{
          columns: [
            { text: 'Data Classification:', style: 'label', width: 'auto' },
            { text: data.tier_name, style: 'value', margin: [10, 0, 0, 0] }
          ],
          margin: [0, 0, 0, 15]
        }] : []),

        // Divider
        {
          canvas: [{
            type: 'line',
            x1: 0, y1: 0,
            x2: 515, y2: 0,
            lineWidth: 1,
            lineColor: '#E5E7EB'
          }],
          margin: [0, 0, 0, 20]
        },

        // Services Section
        { text: 'Approved Services', style: 'sectionTitle', margin: [0, 0, 0, 10] },

        // Services Table
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              // Header row
              [
                { text: 'Service', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader', alignment: 'right' },
                { text: 'Monthly', style: 'tableHeader', alignment: 'right' },
                { text: 'Annual', style: 'tableHeader', alignment: 'right' }
              ],
              // Data rows
              ...items.map(item => [
                {
                  stack: [
                    { text: item.serviceName || item.service, style: 'serviceName' },
                    ...(item.itNotes ? [{ text: `IT Note: ${item.itNotes}`, style: 'itemNote', margin: [0, 2, 0, 0] }] : [])
                  ]
                },
                { text: `${item.quantity} ${item.unit || 'units'}`, style: 'tableCell', alignment: 'right' },
                { text: formatCurrency(item.monthlyEstimate), style: 'tableCell', alignment: 'right' },
                { text: formatCurrency(item.annualEstimate), style: 'tableCell', alignment: 'right' }
              ])
            ]
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5,
            vLineWidth: () => 0,
            hLineColor: (i) => i === 1 ? '#9CA3AF' : '#E5E7EB',
            paddingTop: () => 8,
            paddingBottom: () => 8
          },
          margin: [0, 0, 0, 15]
        },

        // Totals
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                widths: ['auto', 'auto'],
                body: [
                  [
                    { text: 'Monthly Total:', style: 'totalLabel', alignment: 'right' },
                    { text: formatCurrency(data.totals?.monthly), style: 'totalValue', alignment: 'right' }
                  ],
                  [
                    { text: 'Annual Total:', style: 'totalLabelBold', alignment: 'right' },
                    { text: formatCurrency(data.totals?.annual), style: 'totalValueBold', alignment: 'right' }
                  ]
                ]
              },
              layout: 'noBorders'
            }
          ],
          margin: [0, 0, 0, 25]
        },

        // Notes Section (if any)
        ...(data.final_notes ? [
          { text: 'Additional Notes', style: 'sectionTitle', margin: [0, 0, 0, 10] },
          {
            table: {
              widths: ['*'],
              body: [[{
                text: data.final_notes,
                style: 'notesText',
                margin: [10, 10, 10, 10]
              }]]
            },
            layout: {
              fillColor: '#F9FAFB',
              hLineWidth: () => 0,
              vLineWidth: () => 0
            },
            margin: [0, 0, 0, 20]
          }
        ] : []),

        // Divider
        {
          canvas: [{
            type: 'line',
            x1: 0, y1: 0,
            x2: 515, y2: 0,
            lineWidth: 1,
            lineColor: '#E5E7EB'
          }],
          margin: [0, 10, 0, 15]
        },

        // Next Steps
        { text: 'Next Steps', style: 'sectionTitle', margin: [0, 0, 0, 10] },
        {
          ul: [
            'This approval authorizes the provisioning of the services listed above.',
            'Research IT will contact you to coordinate setup and access.',
            'Charges will begin upon service activation.',
            'Keep this receipt for your grant documentation.'
          ],
          style: 'nextStepsList',
          margin: [0, 0, 0, 20]
        },

        // Footer disclaimer
        {
          text: 'This document serves as official approval for the research computing services requested. For questions or changes, contact Research IT.',
          style: 'disclaimer',
          margin: [0, 20, 0, 0]
        }
      ],

      // Styles
      styles: {
        headerText: {
          fontSize: 10,
          color: '#6B7280'
        },
        headerBadge: {
          fontSize: 10,
          color: '#059669',
          bold: true
        },
        footerText: {
          fontSize: 9,
          color: '#9CA3AF'
        },
        title: {
          fontSize: 22,
          bold: true,
          color: '#111827'
        },
        approvedBadge: {
          fontSize: 12,
          bold: true,
          color: '#ffffff',
          fillColor: '#059669'
        },
        label: {
          fontSize: 10,
          color: '#6B7280',
          margin: [0, 0, 0, 2]
        },
        value: {
          fontSize: 12,
          color: '#111827'
        },
        sectionHeader: {
          fontSize: 11,
          bold: true,
          color: '#374151'
        },
        contactText: {
          fontSize: 11,
          color: '#4B5563'
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          color: '#111827'
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          color: '#374151',
          fillColor: '#F9FAFB'
        },
        tableCell: {
          fontSize: 11,
          color: '#374151'
        },
        serviceName: {
          fontSize: 11,
          color: '#111827'
        },
        itemNote: {
          fontSize: 9,
          color: '#6B7280',
          italics: true
        },
        totalLabel: {
          fontSize: 11,
          color: '#6B7280'
        },
        totalValue: {
          fontSize: 11,
          color: '#374151'
        },
        totalLabelBold: {
          fontSize: 12,
          bold: true,
          color: '#111827'
        },
        totalValueBold: {
          fontSize: 14,
          bold: true,
          color: '#111827'
        },
        notesText: {
          fontSize: 11,
          color: '#4B5563'
        },
        nextStepsList: {
          fontSize: 11,
          color: '#4B5563'
        },
        disclaimer: {
          fontSize: 9,
          color: '#9CA3AF',
          italics: true,
          alignment: 'center'
        }
      },

      defaultStyle: {
        font: 'Helvetica'
      }
    }

    return docDefinition
  }

  /**
   * Format currency value
   */
  function formatCurrency(amount) {
    if (amount == null) return 'TBD'
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  /**
   * Download approval receipt PDF
   */
  async function downloadApprovalPdf(plan, options = {}) {
    const pdfMake = await getPdfMake()
    const docDefinition = generateApprovalReceipt(plan, options)
    const filename = `${plan.id || 'plan'}-approval-receipt.pdf`

    pdfMake.createPdf(docDefinition).download(filename)
  }

  /**
   * Open approval receipt PDF in new tab
   */
  async function openApprovalPdf(plan, options = {}) {
    const pdfMake = await getPdfMake()
    const docDefinition = generateApprovalReceipt(plan, options)
    pdfMake.createPdf(docDefinition).open()
  }

  return {
    generateApprovalReceipt,
    downloadApprovalPdf,
    openApprovalPdf
  }
}
