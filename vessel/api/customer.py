import frappe
import json

@frappe.whitelist()
def get_contact(doctype,doc_name):
    print(doc_name)
    print("\n\n\n\n\n\n\n\n\n")
    results = frappe.db.sql("""
        SELECT 
            contact.name AS contact_name,
            GROUP_CONCAT(DISTINCT ce.email_id) AS emails,
            GROUP_CONCAT(DISTINCT cp.phone) AS phones
        FROM
            `tabContact` AS contact
        LEFT JOIN
            `tabDynamic Link` AS tdl ON tdl.parent = contact.name
        LEFT JOIN
            `tabContact Email` AS ce ON ce.parent = contact.name
        LEFT JOIN
            `tabContact Phone` AS cp ON cp.parent = contact.name
        WHERE
            tdl.link_doctype = %s AND tdl.link_name = %s
        GROUP BY
            contact.name
        ORDER BY
            contact.name
    """, (doctype, doc_name), as_dict=True)

    contacts_dict = {}
    # return results
    for result in results:
        contact_name = result['contact_name']
        emails = result['emails'].split(',') if result['emails'] else []
        phones = result['phones'].split(',') if result['phones'] else []

        contacts_dict = {
            "contact_id":contact_name,
            'emails': emails,
            'phones': phones
        }
    print(contacts_dict)
    
    return contacts_dict



@frappe.whitelist()
def update_contact_email_ids(contact_name, new_email_ids):
    
    email_ids = json.loads(new_email_ids) # getting from client side email list

    # get the contact document
    contact = frappe.get_doc("Contact", contact_name)
    email_addresses = {email_dict['email_ids'] for email_dict in email_ids} #getting from client side processed list
    existing_email_ids = {email_row.email_id for email_row in contact.email_ids} # getting from database
    added = False 

    # check if email in in database list than add new
    for new_email in email_ids:
        email_id = new_email.get("email_ids")
        try:
            print(email_id)
            if email_id not in existing_email_ids:
                contact.append("email_ids",{
                    "email_id": email_id,
                })
                added = True
        except Exception as e:
            print(f"Error processing email: {e}") 
    
    for email in existing_email_ids:
        if email not in email_addresses:
            email_id_tab = frappe.db.get_value('Contact Email', {'email_id': email,"parent":contact_name},"name")
            frappe.delete_doc("Contact Email",email_id_tab)   
    if added:
        contact.save()
        
    else:
        return "No changes available"
        

@frappe.whitelist()
def update_contact_phone_nos(contact_id, new_phone_nos):
    
    contact_name = json.loads(contact_id)
    phone_nos = json.loads(new_phone_nos) # getting from client side email list

    # get the contact document
    contact = frappe.get_doc("Contact", contact_name)
    phone_nos_list = {phone_dict['phone_nos'] for phone_dict in phone_nos} #getting from client side processed list
    existing_phone_nos = {phone_row.phone for phone_row in contact.phone_nos} # getting from database
    added = False 

    # check if email in in database list than add new
    for new_phone in phone_nos:
        phone_no = new_phone.get("phone_nos")
        
        try:
            if phone_no not in existing_phone_nos:
                contact.append("phone_nos",{
                    "phone": phone_no,
                })
                added = True
        except Exception as e:
            print(f"Error processing phone: {e}") 
    
    # if emails delete from ui to delete email in db
    for phone in existing_phone_nos:
        if phone not in phone_nos_list:
            phone_nos_tab = frappe.db.get_value('Contact Phone', {'phone': phone,"parent":contact_name},"name")
            frappe.delete_doc("Contact Phone",phone_nos_tab)   
    if added:
        contact.save()
        
    else:
        frappe.msgprint(f"No changes made to contact in phone.")

    



    
@frappe.whitelist()
def create_contact(customer_name,customer_id,phone,email):
    # set in dict sets
    email_ids = [{"email_id": email_id} for email_id in email]
    phone_nos = [{"phone": phone_no} for phone_no in phone]
    # create new contact
    doc = frappe.get_doc({
        "doctype": "Contact",  
        "first_name": customer_name,
        "email_ids": email_ids,  
        "phone_nos": phone_nos,  
        "links": [  
            {
                "link_doctype": "Customer",  
                "link_name": customer_id  #link with customer doc
            }
        ]
    })
    
    doc.insert()




    