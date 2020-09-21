import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import CurrencyFormat from 'react-currency-format';

import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import * as callbackActions from '../../store/actions/callback';

import AppBar from '../../components/AppBar';


function Client(props) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectFilterField, setSelectFilterField] = useState('name')

    const [code, setCode] = useState('')
    const [name, setName] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneAdditional, setPhoneAdditional] = useState('');
    const [emailAdditional, setEmailAdditional] = useState('');
    const [edressAdditional, setEdressAdditional] = useState('');
    const [companie, setCompanie] = useState('');
    const [companieName, setCompanieName] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [edress, setEdress] = useState('');
    const [obs, setObs] = useState('');

    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('clients')
            if (res.data.error) {
                props.dispatch(loadingActions.setLoading(false));
                props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + res.data.error));
                return 0;
            }
            setRegisters(res.data);
            setSearch(res.data)
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }

    const handleSubmit = async () => {
        //VALIDAÇÕES
        if (!name || !companieName) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }


        props.dispatch(loadingActions.setLoading(true));
        //CRIA OBJETO PARAR CADASTRAR/ALTERAR
        const regTemp = {
            code,
            name,
            cellphone,
            phone,
            companie,
            edress_additional: edressAdditional,
            email_additional: emailAdditional,
            phone_additional: phoneAdditional,
            email,
            edress,
            document,
            obs
        }
        setRegister(regTemp);

        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`clients/${register.id}`, regTemp)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('clients', regTemp);
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro cadastrado!'));
            }
            setShow(false)
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
        props.dispatch(loadingActions.setLoading(false));
    }


    const handleDelete = async () => {
        props.dispatch(loadingActions.setLoading(true));
        try {
            const res = await api.delete(`clients/${register.id}`);
            loadRegisters();
            setIsUpdating(false);
            setRegister({});
            clearValues();
            setShow(false)
            props.dispatch(toastActions.setToast(true, 'success', 'Registro deletado!'));
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
        props.dispatch(loadingActions.setLoading(false));
    }

    const handleSearch = async () => {
        var tempSearch = [];
        if (selectFilterField === 'id')
            tempSearch = registers.filter(find =>
                String(find.id).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'name')
            tempSearch = registers.filter(find =>
                String(find.name).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'document')
            tempSearch = registers.filter(find =>
                String(find.document).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        setSearch(tempSearch)
    }

    const setUpdating = async (reg) => {
        setIsUpdating(true);
        setRegister(reg);
        setCode(reg.code)
        setName(reg.name)
        setCellphone(reg.cellphone)
        setPhone(reg.phone)
        setCompanie(reg.companie)
        setCompanieName(reg.companie_name)
        setEmailAdditional(reg.email_additional)
        setPhoneAdditional(reg.phone_additional)
        setEdressAdditional(reg.edress_additional)
        setEmail(reg.email)
        setEdress(reg.edress)
        setDocument(reg.document)
        setObs(reg.obs)
        setShow(true);
    }

    const clearValues = () => {
        setCode('')
        setName('')
        setCellphone('')
        setPhone('')
        setEmailAdditional('')
        setPhoneAdditional('')
        setEdressAdditional('')
        setCompanie('')
        setCompanieName('')
        setEdress('')
        setDocument('')
        setObs('')
        setShow(true);
    }


    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
    }

    return (
        <div className="client-container">
            <AppBar />
            <div className="filters">
                <select
                    className="select-search"
                    onChange={e => setSelectFilterField(e.target.value)}>
                    <option value="id">Código</option>
                    <option value="name" selected>Nome</option>
                    <option value="document" selected>Documento</option>
                </select>
                <input
                    className="field-search"
                    value={searchField}
                    onChange={e => setSearchField(e.target.value)}
                    type="text"
                    onKeyPress={handleSearch} />
            </div>

            <MDBTable responsive hover bordered>
                <MDBTableHead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Celular</th>
                        <th>Telefone</th>
                        <th>Credor</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr
                            style={{ cursor: 'pointer' }}
                            onClick={() => setUpdating(reg)}
                            key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.name}</td>
                            <td>{reg.document}</td>
                            <td>{reg.cellphone}</td>
                            <td>{reg.phone}</td>
                            <td>{reg.companie + ' - ' + reg.companie_name}</td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title> Cadastro de Cliente </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        register.id ?
                            <div>
                                <label> Código </label>
                                <label> {': ' + register.id} </label>
                                <br />
                            </div>
                            : ''
                    }

                    <label> Credor </label>
                    <div className="inline">
                        <input
                            style={{ width: 85, marginRight: 5 }}
                            type="text"
                            placeholder="Credor"
                            value={companie}
                            onChange={async e => {
                                setCompanie(e.target.value)
                                if (!e.target.value) {
                                    setCompanieName('')
                                    return
                                }
                                const res = await api.get(`companies/find-by-id/${e.target.value}`)
                                if (res.data)
                                    setCompanieName(res.data.name)
                                else
                                    setCompanieName('')
                            }} />
                        <input
                            type="text"
                            readOnly
                            value={companieName} />
                        <button
                            style={{ width: 'auto', marginLeft: 4, padding: 10 }}
                            onClick={() => props.dispatch(callbackActions.setCallback(true, 'companies', companie))}>
                            <AiOutlineSearch size="25" />
                        </button>
                    </div>

                    <label> Código </label>
                    <input
                        type="text"
                        placeholder="Codigo"
                        value={code}
                        onChange={e => setCode(e.target.value)} />

                    <label> Nome </label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)} />

                    <label> Celular </label>
                    <CurrencyFormat
                        format="## (##) #####-####"
                        mask=" "
                        placeholder="Celular"
                        value={cellphone?cellphone:''}
                        onValueChange={e => setCellphone(e.value)} />

                    <label> Telefone </label>
                    <CurrencyFormat
                        format="## (##) #########"
                        placeholder="Telefone"
                        value={phone?phone:''}
                        onValueChange={e => setPhone(e.value)} />

                    <label> Telefone adicional </label>
                    <CurrencyFormat
                        format="## (##) #########"
                        placeholder="Telefone"
                        value={phoneAdditional?phoneAdditional:''}
                        onValueChange={e => setPhoneAdditional(e.value)} />



                    <label> Email </label>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />

                    <label> Email adicional </label>
                    <input
                        type="text"
                        placeholder="Email"
                        value={emailAdditional}
                        onChange={e => setEmailAdditional(e.target.value)} />


                    <label> Documento (CPF/CNPJ) </label>
                    <CurrencyFormat
                        format="###.###.###-##"
                        placeholder="CPF OU CNPJ"
                        value={document ?document : ''}
                        onValueChange={e => setDocument(e.value)} />

                    <label>  Endereço </label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={edress}
                        onChange={e => setEdress(e.target.value)} />

                    <label>  Endereço adicional </label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={edressAdditional}
                        onChange={e => setEdressAdditional(e.target.value)} />

                    <label>  Observações </label>
                    <input
                        type="text"
                        placeholder="Observações do cliente"
                        value={obs}
                        onChange={e => setObs(e.target.value)} />


                </Modal.Body>
                <div className="modal-footer-container">
                    <button onClick={handleSubmit}> Salvar </button>
                    {isUpdating ? <button onClick={handleDelete} style={{ backgroundColor: '#ff6666' }} > Apagar </button> : <></>}
                    <button onClick={() => setShow(false)} style={{ backgroundColor: '#668cff' }} > Fechar </button>
                </div>
            </Modal>

            <div className="fab-container">
                <button onClick={setNew}> + </button>
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Client);