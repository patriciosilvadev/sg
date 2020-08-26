import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import AppBar from '../../components/AppBar';


function Companie(props) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});

    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('companies')
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
            find.name.toLowerCase().indexOf(searchField + ''.toLowerCase()) > -1
        )
        setSearch(tempSearch)
    }

    const handleSubmit = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const regTemp = {
                name
            }
            setRegister(regTemp)
            if (!register["id"]) {
                const res = await api.post('companies', regTemp)
                setRegisters([...registers, res.data]);
                setSearch(registers)
            } else {
                console.log('alterando')
            }

            setShow(false)
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            console.log(error)
        }

    }


    const open = async (reg) => {
        setShow(true)
        setRegister(reg)
        setName(reg.name)
    }

    const close = async (reg) => {
        console.log('fechou')
        setShow(false)
        setRegister({})
        setName()
    }

    return (
        <div className="companie-container">
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

            <MDBTable responsive hover bordered>
                <MDBTableHead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Opções</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.name}</td>
                            <td><button onClick={() => open(reg)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={close}>
                <Modal.Header>
                    <Modal.Title>Cadastro de empresas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label> Nome </label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleSubmit}> Salvar </button>
                </Modal.Footer>
            </Modal>


            <div className="fab-container">
                <button onClick={() => setShow(true)}> + </button>
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Companie);