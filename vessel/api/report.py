import frappe
import json

def get_balance(row, balance, debit_field, credit_field):
    balance += row.get(debit_field, 0) - row.get(credit_field, 0)
    return balance

# Example usage in a script
@frappe.whitelist()
def calculate_journal_entry_balances(filters):
    filters = json.loads(filters)
    
    conditions = []
    
    party = next((item['party'] for item in filters if 'party' in item), None)
    company = next((item['company'] for item in filters if 'company' in item), None)
    from_date = next((item['from_date'] for item in filters if 'from_date' in item), None)
    to_date = next((item['to_date'] for item in filters if 'to_date' in item), None)
    
    if party:
        conditions.append(f"jea.party LIKE '%{party}%'")
    if company:
        conditions.append(f"je.company LIKE '%{company}%'")
    if from_date and to_date:
        conditions.append(f"je.posting_date BETWEEN '{from_date}' AND '{to_date}'")

    # set default condition only showcase submitted data
    conditions.append(f"je.docstatus=1")
    
    # get data
    query = """
        SELECT
            je.name,
            jea.account,
            je.posting_date,
            je.company,
            jea.user_remark,
            jea.debit,
            jea.credit,
            jea.party,
            jea.custom_attachments,
            tcr.symbol
        FROM
            `tabJournal Entry` AS je
        LEFT JOIN
            `tabJournal Entry Account` AS jea ON je.name = jea.parent
        LEFT JOIN
            `tabCurrency` AS tcr ON jea.account_currency = tcr.name
    """
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
        
    query += """
        ORDER BY
            jea.account,
            je.posting_date,
            je.name
    """
    
    entries = frappe.db.sql(query, as_dict=True)

    # set balance is 0
    balance = 0

    # calculate balances
    for entry in entries:
        balance = get_balance(entry, balance, 'debit', 'credit')
        entry['balance'] = balance  # Add calculated balance to each entry dictionary
      
        
    return entries 
