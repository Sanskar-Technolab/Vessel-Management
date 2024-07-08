import frappe
from frappe.core.doctype.user.user import reset_password    

@frappe.whitelist(allow_guest=1)
def reset_pswd(user):
    print(user)
    reset_password(user)
    
    
@frappe.whitelist(allow_guest=1)
def verify_loggedin():
    return frappe.session.user

@frappe.whitelist(allow_guest=1)
def loggedin_user():
    user = frappe.session.user
    return frappe.db.get_value("User",user,"user_image")