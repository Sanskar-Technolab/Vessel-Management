import frappe
import json


@frappe.whitelist()
def bulk_delete(doctype,delete_list):
    
    for record in delete_list:
        if record != frappe.session.user:
            frappe.delete_doc(doctype,record)
    return True
        
