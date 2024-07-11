import json
import frappe
import requests

# get account customer wise from custome form child table
@frappe.whitelist()
def get_accounts(customer,company):
    return frappe.get_all("Party Account",fields=["name","account","company"],filters=[["parent","=",customer],["company","=",company]])



@frappe.whitelist()
def get_bank_accounts(company):
    account_list =  frappe.get_all("Account",fields=["name"],filters=[["account_type","=","Bank"],["company","=",company],["is_group","=","0"]])
    return account_list


@frappe.whitelist()
def delete_file(file_url,payment_entry_id):
    file_url = json.loads(file_url)
    filedata = frappe.db.get_list("File",filters={"file_url":file_url})
    frappe.delete_doc("File",filedata[0].name)
    return filedata[0].name
   
   
# get default company
@frappe.whitelist()
def get_default_company():
    if frappe.session.user != "Guest":
        return frappe.defaults.get_user_default("Company") 
