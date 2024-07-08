app_name = "vessel"
app_title = "Vessel"
app_publisher = "Sanskar Technolab"
app_description = "Vessel Management"
app_email = "darshit@sanskartechnolab.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/vessel/css/vessel.css"
# app_include_js = "/assets/vessel/js/vessel.js"


# include js, css files in header of web template
# web_include_css = "/assets/vessel/css/vessel.css"
# web_include_js = "/assets/vessel/js/vessel.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "vessel/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "vessel/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "vessel.utils.jinja_methods",
# 	"filters": "vessel.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "vessel.install.before_install"
# after_install = "vessel.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "vessel.uninstall.before_uninstall"
# after_uninstall = "vessel.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "vessel.utils.before_app_install"
# after_app_install = "vessel.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "vessel.utils.before_app_uninstall"
# after_app_uninstall = "vessel.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "vessel.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"vessel.tasks.all"
# 	],
# 	"daily": [
# 		"vessel.tasks.daily"
# 	],
# 	"hourly": [
# 		"vessel.tasks.hourly"
# 	],
# 	"weekly": [
# 		"vessel.tasks.weekly"
# 	],
# 	"monthly": [
# 		"vessel.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "vessel.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "vessel.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "vessel.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["vessel.utils.before_request"]
# after_request = ["vessel.utils.after_request"]

# Job Events
# ----------
# before_job = ["vessel.utils.before_job"]
# after_job = ["vessel.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"vessel.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }


fixtures = [
    {
        "dt": "Role Profile",
    },
]

website_route_rules = [
    {"from_route": "/admin", "to_route": "/admin/admin"},
    {"from_route": "/user/new-user", "to_route": "/user/user"},
    {"from_route": "/user", "to_route": "/user/userlist"},
    {"from_route": "/logistic", "to_route": "/logistic/logistic"},
    {"from_route": "/logistic/customer/new-customer", "to_route": "/customer/customer"},
    {"from_route": "/logistic/customer", "to_route": "/customer/customer-list"},
    {"from_route": "/accounts", "to_route": "/account/account"},
    {"from_route": "/accounts/account", "to_route": "/account/account-list"},
    {"from_route": "/accounts/account/new-account", "to_route": "/account/account-form"},
    {"from_route": "/accounts/payment-entry", "to_route": "/account/payment-entry-list"},
    {"from_route": "/accounts/payment-entry/new-payment-entry", "to_route": "/account/payment-entry-form"},
    {"from_route": "/accounts/company/new-company", "to_route": "/company/company-form"},
    {"from_route": "/accounts/company", "to_route": "/company/company-list"},
    {"from_route": "/accounts/company/<name>", "to_route": "/company/updatecompany"},
    {"from_route": "/analytics", "to_route": "/analytics/analytics"},
    {"from_route": "/login", "to_route": "/login/login"},
    {"from_route": "/user/<name>", "to_route": "/user/updateuser"},
    {"from_route": "/logistic/customer/<name>", "to_route": "/customer/updatecustomer"},
    {"from_route": "/accounts/account/<name>", "to_route": "/account/updateaccount"},
    {"from_route": "/accounts/payment-entry/<name>", "to_route": "/account/update-payment-entry"},
    
]
