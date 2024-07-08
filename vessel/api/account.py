import json
import frappe
import requests

# get account customer wise from custome form child table
@frappe.whitelist()
def get_accounts(customer,company):
    print(customer)
    print(company)
    print("\n\n\n\n\n\n\n\n\n")
    return frappe.get_all("Party Account",fields=["name","account","company"],filters=[["parent","=",customer],["company","=",company]])



@frappe.whitelist()
def get_bank_accounts(company):
    account_list =  frappe.get_all("Account",fields=["name"],filters=[["account_type","=","Bank"],["company","=",company],["is_group","=","0"]])
    return account_list


@frappe.whitelist()
def delete_file(file_url,payment_entry_id):
    print(file_url)
    file_url = json.loads(file_url)
    print("\n\n\n\n\n\n\n\n\n")
    filedata = frappe.db.get_list("File",filters={"file_url":file_url})
    frappe.delete_doc("File",filedata[0].name)
    return filedata[0].name
   
   
   


# @frappe.whitelist()
# def balance_summary_report(filters):
#     filters = json.loads(filters)
    
#     conditions = []
    
#     party = next((item['party'] for item in filters if 'party' in item), None)
#     company = next((item['company'] for item in filters if 'company' in item), None)
#     from_date = next((item['from_date'] for item in filters if 'from_date' in item), None)
#     to_date = next((item['to_date'] for item in filters if 'to_date' in item), None)
    
        
#     if party:
#         conditions.append(f"jea.party LIKE '%{party}%'")
#     if company:
#         conditions.append(f"je.company LIKE '%{company}%'")
#     if from_date and to_date:
#         conditions.append(f"je.posting_date BETWEEN '{from_date}' AND '{to_date}'")


    
#     # query = """
#     #     SELECT
#     #         je.name,
#     #         jea.account,
#     #         je.posting_date,
#     #         je.company,
#     #         jea.user_remark,
#     #         jea.debit,
#     #         jea.credit,
#     #         jea.party,
#     #         CASE 
#     #             WHEN jea.account = 'Debtors' AND jea.debit > 0 THEN jea.debit
#     #             WHEN jea.account = 'Debtors' AND jea.credit > 0 THEN -jea.credit
#     #             ELSE jea.debit - jea.credit
#     #         END AS balance,
#     #         jea.custom_attachments
#     #     FROM
#     #         `tabJournal Entry` AS je
#     #     LEFT JOIN
#     #         `tabJournal Entry Account` AS jea
#     #     ON
#     #         je.name = jea.parent;
#     # """
    
#     query = """
#         SELECT
#             je.posting_date,
#             jea.account,
#             je.name,
#             je.company,
#             jea.user_remark,
#             jea.debit,
#             jea.credit,
#             jea.party,
#             jea.custom_attachments,
#             SUM(jea.debit - jea.credit) OVER (PARTITION BY jea.account ORDER BY je.posting_date, je.name) AS balance
#         FROM
#             `tabJournal Entry` AS je
#         LEFT JOIN
#             `tabJournal Entry Account` AS jea ON je.name = jea.parent

    
#     """

   
#     if conditions:
#         query += " WHERE " + " AND ".join(conditions)
    

#     print(query)
#     print("\n\n\n\n\n\n\n\n")

#     balance_summary = frappe.db.sql(query, as_dict=True)
  
#     return balance_summary
