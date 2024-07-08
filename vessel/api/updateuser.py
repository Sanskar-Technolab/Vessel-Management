import frappe
import json


@frappe.whitelist()
def delete_old_file(file_url,attached_to_name,attached_to_field,attached_to_doctype,remove):
 
    if remove == "1":
        frappe.db.set_value(attached_to_doctype,attached_to_name,attached_to_field,"")
        
    old_file = frappe.get_list("File",fields=["name"],filters=[["file_url","=",file_url],["attached_to_name","=",attached_to_name],["attached_to_field","=",attached_to_field],["attached_to_doctype","=",attached_to_doctype]])

    old_file_name = old_file[0].name
    frappe.delete_doc("File",old_file_name)

    return True


@frappe.whitelist()
def update_email(old_email,new_email):
    try:
        old_email = json.loads(old_email)
        new_email = json.loads(new_email)
        frappe.rename_doc('User',old_email, new_email)
        return True
    except Exception as e:
        return "ERROR"


