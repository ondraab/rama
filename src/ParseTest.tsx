import * as React from 'react';
import 'isomorphic-fetch';

export interface Props {
    pdbID: string;
}

export class RamaData extends React.Component<Props> {
    render() {
        const {pdbID} = this.props;
        let molecules: Array<object> = [];
        fetch('http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + pdbID)
            .then(response =>
                response.json().then(data => ({
                        data: data,
                        status: response.status
                    })
                ).then(res => {
                    for (let mol of res.data[pdbID].molecules) {
                        let newMolecule = new Molecule(mol.chains);
                        molecules.push(newMolecule);
                    }
                }));
        return (;
        for (let mol of molecules) {
                console.log();;
            }
        )
    }
}
export class Molecule {
    public chain: object[];

    constructor(private chainArg: object[]) {
        this.chain = chainArg;
        for (let chan of this.chainArg) {
            new ChainClass(chan['models']);
        }
    }
}

class ChainClass {

    constructor(private models: object[]) {
        for (let mod of this.models) {
            new ModelClass(mod['residues']);
        }
    }
}

class ModelClass {
    constructor(private residues: object[]) {
        for (let res of this.residues) {
            new ResidueClass(res);
        }

    }
}

class ResidueClass extends React.Component {
    private psi: number;
    private residueNumber: number;
    private rama: string;
    private phi: number;
    private residueName: string;
    private rota: string;

    constructor(private residue: object) {
        super(residue);
        this.psi = this.residue['psi'];
        this.phi = this.residue['phi'];
        this.residueName = this.residue['residue_name'];
        this.residueNumber = this.residue['residue_number'];
        this.rama = this.residue['rama'];
        this.rota = this.residue['rota'];
    }
    render() {
        return(
            <div id="phi"> try {this.phi.toString()}</div>
        );
    }
}

export default RamaData;
