import React from 'react';
import Navbar from "./Navbar";

class List extends React.Component{
    constructor(props){
        super(props);
        this.state={
            old_group: '',
            contact_group: '',
            contact_id: '',
            first_name: '',
            last_name: '',
            email: '',
            work_phone: '',
            personal_phone: '',
            address: '',
            birthday: '',
            data: [],
            editingGroup: '',
            searchQuery: '',
            searchColumn: '',
            isEditing: false,
            selectedForDeletion: null,
            selectedForEdit: null,
            disableDeleteButtons: false,
        };
    }


/* BLUE "CONTACTS" TEXT */
    displayContactsMessage () {
        return (
            <p className={"linkList"} onClick={() => window.location.reload()}>contacts&nbsp;</p>
        );
    }
/* BLUE "CONTACTS" TEXT */


/* INITIAL FETCH DATA */
    fetchData(){
        fetch('http://127.0.0.1:8000/contact/')
        .then(response=>response.json())
        .then((data)=>{
            this.setState({
                data:data
            });
        });
    }
/* INITIAL FETCH DATA */

/* TODO: Move fetchData and componentDidMount to App.js */

/* LIFECYCLE METHOD */
    componentDidMount(){
        const savedContactGroup = localStorage.getItem('contact_group');
        if (savedContactGroup) {
          this.setState({ contact_group: savedContactGroup });
        }

        fetch('http://127.0.0.1:8000/contact/')
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    this.setState({ contact_group: "New Group 1" });
                    this.addContact();}})
        this.fetchData();
    }
/* LIFECYCLE METHOD */


/* DELETE CONTACT */
    deleteData(id){
        if (this.state.selectedForDeletion === id) {
            fetch('http://127.0.0.1:8000/contact/' + id + '/', {
                method: 'DELETE',
                body: JSON.stringify(this.state),
            })
            .then(response => response)
            .then((data) => {
                if(data) {
                    this.setState({ selectedForDeletion: null });
                    this.fetchData();
                }
            });
        } else {
            this.setState({ selectedForDeletion: id, selectedForEdit: null });
        }
    }
/* DELETE CONTACT */


/* EDIT CONTACT */
    editData(id) {
        if (this.state.selectedForEdit === id) {
            const updatedContact = this.getUpdatedContactInfo(id);
            this.updateContact(id, updatedContact);
        } else {
            this.setState({ selectedForEdit: id, selectedForDeletion: null });
        }
    }

    getUpdatedContactInfo(id) {
        const contactInfo = {
            contact_id: "",
            first_name: "",
            last_name: "",
            email: "",
            work_phone: "",
            personal_phone: "",
            address: "",
            birthday: "",
        };
        const fields = ["contact_id", "first_name", "last_name", "email", "work_phone", "personal_phone", "address", "birthday"];
        fields.forEach((field) => {
            contactInfo[field] = document.querySelector(`#${field}-${id}`).value;
        });
        return contactInfo;
    }

    updateContact(id, updatedContact) {
        fetch('http://127.0.0.1:8000/contact/' + id + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
        })
            .then((response) => response)
            .then((data) => {
                if (data) {
                    this.setState({ selectedForEdit: null });
                    this.fetchData();
                }
            });
    }
/* EDIT CONTACT */


/* CANCEL EDIT/DELETE */
    cancel = () => {
        this.setState({ selectedForEdit: null });
        this.setState({ selectedForDeletion: null });
    };
/* CANCEL EDIT/DELETE */


/* ADD CONTACT */
    addContact = () => {
        this.setState({
            contact_id: '',
            first_name: '',
            last_name: '',
            email: '',
            work_phone: '',
            personal_phone: '',
            address: '',
            birthday: ''
        }, () => {
            let data = {...this.state};
            fetch('http://127.0.0.1:8000/contact/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then(response => response.json())
            .then((data) => {
                this.fetchData();
                localStorage.setItem('contact_group', this.state.contact_group);
                this.setState({ selectedForEdit: data.id, selectedForDeletion: null });
            });
        });
    }
/* ADD CONTACT */


/* EDIT GROUP NAME */
    handleEdit = () => {
        this.setState({
            isEditing: true
        });
    };
    handleChange = event => {
        this.setState({
          contact_group: event.target.value
        });
    };
    handleSubmit = () => {
        this.state.data.forEach((contact) => {
            if (contact.contact_group === this.state.oldGroup) {
                let updatedContact = {
                    contact_group: this.state.contact_group,
                };
                fetch(`http://127.0.0.1:8000/contact/${contact.id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedContact),})
                    .then(response => response)
                    .then((data) => {
                        if (data) {
                            this.fetchData();
                            localStorage.setItem('contact_group', this.state.contact_group);
                        }
                    });
            }
        });
        this.setState({ isEditing: false });
    };
/* EDIT GROUP NAME */


//TODO: write downloadAsPDF function


/* RENDER BUTTONS */
    renderButtons(contact) {
        const buttonStyles = {padding: 4}
        const editButton = (
            <button style={{marginLeft: 0}} className="btn btn-outline-info" onClick={() => this.editData(contact.id)}>
                {this.state.selectedForEdit === contact.id ? "Save" : "Edit"}
            </button>
        );
        const cancelButton = (
            <button className="btn btn-outline-dark" style={{ marginLeft: this.state.selectedForEdit === contact.id ? 4 : 0 }}
                onClick={() => this.cancel(contact.id)}>Cancel
            </button>
        );
        const deleteButton = (
            <button className="btn btn-outline-danger" style={{ marginLeft: 4, opacity: this.state.disableDeleteButtons ? 0.2 : 1 }}
                disabled={!!this.state.disableDeleteButtons} onClick={() => this.deleteData(contact.id)}>
                {this.state.selectedForDeletion === contact.id ? "Sure?" : "Delete"}
            </button>
        );
        let buttonGroup;
        if (this.state.selectedForEdit === contact.id) { buttonGroup = <>{editButton}{cancelButton}</>; }
        else if (this.state.selectedForDeletion === contact.id) { buttonGroup = <>{cancelButton}{deleteButton}</>; }
        else { buttonGroup = <>{editButton}{deleteButton}</>; }
        return <td style={buttonStyles}>{ buttonGroup }</td>;
    }
/* RENDER BUTTONS */


/* RENDER MENU */
    renderMenu() {
        if (this.state.data.length === 0) {
            return (
                <Navbar/>
            );
        }
        const uniqueContactGroups = [...new Set(this.state.data.map(contact => contact.contact_group))];
        let newGroupName = `New Group ${uniqueContactGroups.length}`;
        while (uniqueContactGroups.includes(newGroupName)) {
            const number = parseInt(newGroupName.slice(-1), 10);
            newGroupName = newGroupName.slice(0, -1) + (number + 1);
        }
        return (
            <div>
                <Navbar/>
                <input type="search" value={this.state.searchQuery} placeholder=" Search by first name..."
                        onChange={e => this.setState({searchQuery: e.target.value})}
                        style={{ position: "absolute", top: 10, left: 520, borderRadius: 8, borderWidth: 0,
                            height: 35, width: 600, outline: 'none', paddingLeft: 10}}/>
                <button onClick={() => {this.addContact();this.setState({contact_group: newGroupName});}} className="btn btn-outline-success"
                        style={{ position: "absolute", left: 16, top: 70, width: 35, height: 35, borderRadius: 5, padding: 0, fontSize: 40,
                            background: "white", color: "green", borderColor: "green" }}>
                    <div style={{ marginTop: -17.9, marginLeft: -0.5 }}>+</div>
                </button>
            </div>
        );
    }
/* RENDER MENU */


/* RENDER TABLES */
    render() {
        const {data, searchQuery} = this.state;
        const groups = data.reduce((acc, contact) => {
            if (!acc[contact.contact_group]) {
                acc[contact.contact_group] = [];
            }
            acc[contact.contact_group].push(contact);
            return acc;
        }, {});
        this.matchedContacts = Object.entries(groups).filter(([group, contacts]) => {
            return contacts.some(contact =>
                contact.first_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });

        if ((data.length !== 0)  && this.matchedContacts.length === 0) {
            return (
                <div>
                    {this.renderMenu()}
                    <div className={"messages"} style={{ marginLeft: 8 + '%' }}>
                        <h2>No&nbsp;</h2> <div style={{ marginTop: 11.1 + '%' }}>{this.displayContactsMessage()}</div>
                        <h2>matching the first name</h2>
                    </div>
                </div>
            );
        }

        if (data.length === 0) {
            setTimeout(() => {
                this.setState({showMessage: true});
            }, 500);
            return (
                <div>
                    {this.renderMenu()}
                    {this.state.showMessage ? (
                        <div className={"messages"} style={{marginLeft: 27 + '%'}}>
                            <h2>There are no&nbsp;</h2>{this.displayContactsMessage()}
                        </div>
                    ) : null}
                </div>
            );
        }

        const tables = this.matchedContacts.map(([group, contacts]) => {
            const contactData = contacts.filter(contact =>
                contact.first_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const rows = contactData.map(contact => {
                const inputFields = [
                    { id: "contact_id",      defaultValue: contact.contact_id,      width: 44,   maxLength: 4  },
                    { id: "first_name",      defaultValue: contact.first_name,      width: 128,  maxLength: 15 },
                    { id: "last_name",       defaultValue: contact.last_name,       width: 155,  maxLength: 25 },
                    { id: "email",           defaultValue: contact.email,           width: 243,  maxLength: 40 },
                    { id: "work_phone",      defaultValue: contact.work_phone,      width: 140,  maxLength: 15 },
                    { id: "personal_phone",  defaultValue: contact.personal_phone,  width: 139,  maxLength: 15 },
                    { id: "address",         defaultValue: contact.address,         width: 335,  maxLength: 50 },
                    { id: "birthday",        defaultValue: contact.birthday,        width: 86,   maxLength: 10 }
                ];
                const inputFieldsElements = inputFields.map(field => (
                    <td key={`${field.id}-${contact.id}`} style={{padding: 7}}>
                        {this.state.selectedForEdit === contact.id ? (
                            <input type="text" id={`${field.id}-${contact.id}`} defaultValue={field.defaultValue}
                                   style={{width: field.width, marginTop: -4, marginLeft: -4, marginBottom: -4,
                                       ...field.style}} maxLength={field.maxLength} />
                        ) : ( <div className="contactFields">{field.defaultValue}</div> )}
                    </td>
                ));
                return (
                    <tr key={contact.contact_id}>{inputFieldsElements}{this.renderButtons(contact)}</tr>
                );
            });

            return (
                <div key={group}>
                    <div style={{border:"solid", borderWidth: 2, borderColor:"#dce2e3", borderRadius: 10, minWidth: 1540,
                        paddingTop: 20, paddingRight: 20, marginLeft: 30, marginRight: 30, marginBottom: 30, boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.4)"}}>
                        {this.state.editingGroup === group ? (
                            <form style={{ position: "relative", top: -6, left: 78, fontSize: 35, marginBottom: -4.5, maxWidth: 700 }} onSubmit={this.handleSubmit}>
                                <input type="text" value={this.state.contact_group} onChange={this.handleChange}
                                    style={{ fontWeight: 500, outline: "none", borderWidth: 0 }} autoFocus onBlur={() => this.setState({ editingGroup: null })} />
                            </form>
                        ) : (
                            <h3 style={{ position: "relative", top: 0, left: 80, fontSize: 35, maxWidth: 700 }} onClick={() => { this.handleEdit();
                                this.setState({ contact_group: group, editingGroup: group, oldGroup: group }); }}>{group}
                            </h3>
                        ) }

                        <div style={{ maxHeight: 350, overflow: "scroll", marginBottom: 50 }} className="contactGroup">
                            <table className="table table-bordered" style={{width: "100%", minWidth: 1470, maxWidth: 1460, marginLeft: 33 }}>
                                <thead>
                                <tr>
                                    <th style={{ width: 48,  padding: 6, fontSize: 17 }}>ID</th>
                                    <th style={{ width: 124, padding: 6, fontSize: 17 }}>First name</th>
                                    <th style={{ width: 149, padding: 6, fontSize: 17 }}>Last name</th>
                                    <th style={{ width: 230, padding: 6, fontSize: 17 }}>Email</th>
                                    <th style={{ width: 135, padding: 6, fontSize: 17 }}>Work phone</th>
                                    <th style={{ width: 135, padding: 6, fontSize: 17 }}>Personal phone</th>
                                    <th style={{ width: 313, padding: 6, fontSize: 17 }}>Address</th>
                                    <th style={{ width: 86,  padding: 6, fontSize: 17 }}>Birthday</th>
                                    <th style={{ width: 123, padding: 4, fontSize: 17 }}>

                                        <button style={{ marginLeft: 0 }} className="btn btn-outline-success"
                                            onClick={() => { this.addContact();this.setState({ contact_group: group }); }}>Add
                                        </button>

                                        <button style={{ marginLeft: 4 }} className="btn btn-outline-dark"
                                            onClick={() => { this.setState({ disableDeleteButtons: !this.state.disableDeleteButtons }); }}><s>Delete</s>
                                        </button>

                                    </th>
                                </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div>
                {this.renderMenu()}
                {tables}
            </div>
        );
    }
/* RENDER TABLES */
}
export default List;