import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import CurrencyFormat from 'react-currency-format';
import CurrencyInput from 'react-currency-input-field';
import Downshift from 'downshift';
import './style.css';
import myFormat from '../../helpers/myFormat';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import AppBar from '../../components/AppBar';


function User(props) {
    const history = useHistory();
    const header = { headers: { hash: props.state.user.hash, user_id: props.state.user.id } };

    const [show, setShow] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState(1);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companie, setCompanie] = useState('');
    const [companieName, setCompanieName] = useState('');
    const [companies, setCompanies] = useState([]);
    const [adress, setAdress] = useState('');
    const [document, setDocument] = useState('');
    const [identitet, setIdentitet] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [lastUser, setLastUser] = useState('');
    const [obs, setObs] = useState('');


    useEffect(() => {
        loadRegisters();
    }, []);

    const handleSubmit = async () => {
        props.dispatch(loadingActions.setLoading(true));

        //VALIDAÇÕES
        if (!name) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }

        //VALIDAÇÕES
        if (!userName) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }
        //VALIDAÇÕES
        if (!password) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }
        //VALIDAÇÕES
        if (password !== confirmPassword) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'As senhas devem ser identicas!'));
            return 0
        }

        //CRIA OBJETO PARAR CADASTRAR/ALTERAR
        const regTemp = {
            name,
            username: userName,
            password,
            user_type: userType,
            adress,
            document,
            companie,
            email,
            phone,
            identitet,
            obs
        }

        setRegister(regTemp);

        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`users/${register.id}`, regTemp, header)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('users', regTemp, header);
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
            const res = await api.delete(`users/${register.id}`, header);
            setIsUpdating(false);
            setRegister({});
            clearValues();
            loadRegisters();
            setShow(false)
            props.dispatch(toastActions.setToast(true, 'success', 'Registro deletado!'));
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
        props.dispatch(loadingActions.setLoading(false));
    }


    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('users', header)
            setRegisters(res.data);
            setSearch(res.data)
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = async () => {
        var tempSearch = [];
        tempSearch = registers.filter(find =>
            find.name.toLowerCase().indexOf(String(searchField).toLowerCase()) > -1
        )
        setSearch(tempSearch)
    }

    const clearValues = () => {
        setRegister({});
        setName('');
        setUserName('');
        setPassword('');
        setUserType(1)
        setConfirmPassword('');
        setAdress('');
        setDocument('');
        setCompanie('');
        setCompanieName('');
        setIdentitet('');
        setPhone('');
        setEmail('');
        setObs('');
    }


    const setUpdating = (reg) => {
        console.log(reg.user_type)
        setIsUpdating(true);
        setRegister(reg);
        setName(reg.name);
        setUserType(reg.user_type);
        setUserName(reg.username);
        setPassword(reg.password);
        setConfirmPassword(reg.password);
        setCompanie(reg.companie)
        setCompanieName(reg.companie_name)
        setAdress(reg.adress);
        setDocument(reg.document);
        setIdentitet(reg.identitet);
        setPhone(reg.phone);
        setEmail(reg.email);
        setObs(reg.obs);
        setShow(true);
    }

    const hide = async (reg) => {
        setShow(false);
        clearValues();
        setIsUpdating(false);
    }

    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
    }

    return (
        <div className="user-container">
            <AppBar />
            <div className="filters">
                <label> Nome: </label>
                <input
                    className="field-search"
                    value={searchField}
                    onChange={e => setSearchField(e.target.value)}
                    type="text"
                    onKeyPress={handleSearch} />
            </div>

            <MDBTable responsive hover bordered className="table">
                <MDBTableHead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Usuário</th>
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
                            <td>{reg.username}</td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => console.log('Cant close')}>
                <Modal.Header>
                    <Modal.Title>Cadastro de Usuários</Modal.Title>
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

                    <label> Tipo de Usuário </label>
                    <select
                        onChange={e => { setUserType(parseInt(e.target.value)); console.log(e.target.value) }}>
                        <option value={1} selected={userType === 1 ? true : false} >ATENDENTE</option>
                        <option value={2} selected={userType === 2 ? true : false} >ADMINISTRADOR</option>
                        <option value={0} selected={userType === 0 ? true : false} >CREDOR</option>
                    </select>

                    {userType === 0 ?
                        <div>
                            <label> Credor </label>
                            <Downshift inputValue={companieName} inputValue={companieName} onChange={selection => {
                                setCompanie(selection.id)
                                setCompanieName(selection.name)
                                setCompanies(selection)
                            }}
                                itemToString={item => (item ? item.name : '')}>
                                {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, getRootProps }) => (
                                    <div>
                                        <div {...getRootProps({}, { suppressRefError: true })} className="inline">
                                            <input value={companie} type="number" readOnly style={{ width: 80, marginRight: 5 }} />
                                            <input
                                                type="text"
                                                placeholder="Pesquisa"
                                                value={companieName}
                                                onChangeCapture={async e => {
                                                    setCompanieName(e.target.value)
                                                    if (!e.target.value || e.target.value.length < 3) return;
                                                    const { data } = await api.get(`companies/find-by-name/${e.target.value}`, header);
                                                    setCompanies(data);
                                                }}
                                                {...getInputProps()} />
                                        </div>
                                        <ul {...getMenuProps({})}>
                                            {isOpen ? companies
                                                .filter(item => !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase()))
                                                .map((item) => (
                                                    <li
                                                        className="search-field-results"
                                                        {...getItemProps({ key: item.id, item })}>
                                                        {`${item.id} - ${item.name}`}
                                                    </li>))
                                                : null}
                                        </ul>
                                    </div>
                                )}
                            </Downshift>
                        </div>
                        : <></>
                    }

                    <label> Nome </label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)} />

                    <label> Usuário </label>
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={userName}
                        onChange={e => setUserName(e.target.value)} />

                    <label> Telefone </label>
                    <CurrencyFormat
                        format="## (##) #########"
                        placeholder="Telefone"
                        value={phone ? phone : ''}
                        onValueChange={e => setPhone(e.value)} />

                    <label> Email </label>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />

                    <label>  Endereço </label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={adress}
                        onChange={e => setAdress(e.target.value)} />

                    <label> CPF </label>
                    <CurrencyFormat
                        format="###.###.###-##"
                        placeholder="CPF"
                        value={document ? document : ''}
                        onValueChange={e => setDocument(e.value)}
                        on />

                    <label> Identidade </label>
                    <input
                        type="text"
                        placeholder="Identidade"
                        value={identitet}
                        onChange={e => setIdentitet(e.target.value)} />

                    <label> Senha </label>
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)} />

                    <label> Repita a Senha </label>
                    <input
                        type="password"
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} />

                    <label> Obs </label>
                    <input
                        type="text"
                        placeholder="Observação"
                        value={obs}
                        onChange={e => setObs(e.target.value)} />

                    {register.created_at ?
                        <div>
                            <p> Criado em {register.created_at} {!register.updated_at ? ' por ' + register.last_user + ' - ' + register.last_user_name : ''} </p>
                            <p>{register.updated_at ? 'Ultima alteração feita em ' + register.updated_at + ' por ' + register.last_user + ' - ' + register.last_user_name : 'Registro ainda não foi alterado.'}</p>
                        </div>
                        : <></>
                    }
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

export default connect(state => ({ state }))(User);