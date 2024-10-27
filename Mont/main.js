// Variables globales para almacenar matrices y resultados
let mat = [];
let matAct = [];
let resp = [];
let matAdj = [];
let matInv = [];

// Referencias a elementos del DOM
let divEc = document.getElementById('ecuaciones');
let seeMat = document.getElementById('seeMat');
let solution = document.getElementById('solution');
let answers = document.getElementById('answers');

// Función para crear los campos de entrada de ecuaciones
function crearEc() {
    let n = getN();

    // Validación del número de ecuaciones
    if (!(/^\d+$/.test(n)) || n < 1) {
        alert('El numero de ecuaciones debe ser un número positivo');
        document.getElementById('n').value = '';
        return;
    }

    clearEc();

    let button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Mostrar Matriz';
    button.onclick = saveIndex;

    // Crear campos de entrada para las ecuaciones
    for (let i = 0; i < n; i++) {
        let inputRes = document.createElement('input');

        for (let j = 0; j < n; j++) {
            let inputX = document.createElement('input');

            inputX.type = 'number';
            inputX.id = `x${i}${j}`;
            divEc.appendChild(inputX);
            divEc.appendChild(document.createTextNode(`x${j}`));

            if (j < n - 1) {
                divEc.appendChild(document.createTextNode(' + '));
            }
        }

        divEc.appendChild(document.createTextNode(' = '));
        inputRes.type = 'number';
        inputRes.id = `res${i}`;
        divEc.appendChild(inputRes);
        divEc.appendChild(document.createElement('br'));
        divEc.appendChild(document.createElement('br'));
    }

    divEc.appendChild(button);
}

// Función para limpiar los campos de entrada de ecuaciones
function clearEc() {
    divEc.innerHTML = '';
    mat = [];
    matAct = [];
    resp = [];
    seeMat.innerHTML = '';
    solution.innerHTML = '';
    answers.innerHTML = '';
}

// Función para guardar los valores ingresados en las matrices
function saveIndex() {
    let n = getN();
    mat = [];
    matAct = [];
    resp = [];

    // Guardar valores de la matriz y resultados
    for (let i = 0; i < n; i++) {
        mat.push([]);
        matAct.push([]);

        for (let j = 0; j < n; j++) {
            let value = document.getElementById(`x${i}${j}`).value;

            if (value === '' || isNaN(value)) {
                alert('Verifica que los campos esten correctamente completados');
                return;
            } else {
                value = parseFloat(value);
                mat[i][j] = value;
            }
        }

        let res = document.getElementById(`res${i}`).value;
        if (res === '' || isNaN(res)) {
            alert('Verifica que los campos esten correctamente completados');
            return;
        } else {
            res = parseFloat(res);
            resp.push(res);
        }
    }

    console.log(mat);
    getIdentMat(n);

    // Mostrar la matriz ingresada
    let math = document.createElement('math');
    let mrow = document.createElement('mrow');
    mrow.id = 'mrow';
    let mtable = document.createElement('mtable');
    let mtr = document.createElement('mtr');

    for (let i = 0; i < resp.length; i++) {
        let mtd = document.createElement('mtd');
        let mn = document.createElement('mn');

        mn.textContent = resp[i];
        mtd.appendChild(mn);
        mtr.appendChild(mtd);
    }

    mtable.appendChild(mtr);
    mrow.appendChild(mtable);
    math.appendChild(mrow);

    seeMatrix(math);
}

// Función para obtener el número de ecuaciones
function getN(num) {
    let n;

    if (num == undefined) {
        n = document.getElementById('n').value;
    }else{
        n = num;
    }

    n = parseInt(n);
    return n;
}

// Función para obtener la matriz identidad
function getIdentMat(num) {
    for (let i = num; i < 2 * num; i++) {
        mat.push([]);
        matAct.push([]);

        for (let j = 0; j < num; j++) {
            mat[i].push(i === (parseInt(j) + parseInt(num)) ? 1 : 0);
        }
    }
}

// Función para mostrar la matriz en el DOM
function seeMatrix(resp) {
    let res = resp;
    seeMat.innerHTML = '';

    let math = printMat(mat);

    let btnSolve = document.createElement('button');
    btnSolve.type = 'submit';
    btnSolve.textContent = 'Calcular';
    btnSolve.onclick = solve;

    let mtx = document.createElement('h3');
    mtx.textContent = 'Matriz: ';
    seeMat.appendChild(math);

    if (res !== undefined) {
        let h3 = document.createElement('h3');
        h3.textContent = 'Matriz de coeficientes independientes: ';
        seeMat.appendChild(h3);
        seeMat.appendChild(res);
    }

    seeMat.appendChild(document.createElement('br'));
    seeMat.appendChild(btnSolve);
}

// Función para resolver el sistema de ecuaciones
function solve() {
    let n = getN(); // Obtener el tamaño de la matriz original
    let pivAnt = 1; // Valor inicial del pivote anterior (inicialmente 1)
    let pivAct = 0; // Valor del pivote actual
    let numPiv = 0; // Contador de pivotes
    solution.innerHTML = ''; // Limpiar el contenedor de la solución
    answers.innerHTML = ''; // Limpiar el contenedor de las respuestas

    if (mat == 0) {
        alert('Debes mostrar la matriz antes de calcular');
        return;
        
    }

    // Verificación de la diagonal principal
    let isDiagonalValid = checkDiag();
    
    if (isDiagonalValid == 0) {
        let h4 = document.createElement('h4');
        h4.style.color = '#e0e0e0';
        h4.textContent = `No se puede resolver por este método`;
        seeMat.appendChild(h4);
        console.error('Elemento no reacomodable en la matriz');
        return;
    } else {
        let math = printMat(mat);
        solution.appendChild(math);
    }

    while (numPiv < n) {
        // Buscar el pivote actual
        pivAct = mat[numPiv][numPiv];

        // Copiar la fila relevante a matAct (tanto la parte de la matriz original como la identidad)
        for (let k = 0; k < n; k++) {
            matAct[numPiv][k] = mat[numPiv][k];
            matAct[numPiv + n][k] = mat[numPiv + n][k];
        }

        // Colocar 0 en los elementos arriba y abajo del pivote y calcular nuevos elementos
        for (let i = 0; i < n; i++) {
            if (i !== numPiv) {
                for (let j = 0; j < n; j++) {
                    if (j != numPiv) {
                        // Cálculo de nuevos elementos usando pivAnt
                        matAct[i][j] = ((mat[i][j] * pivAct) - (mat[i][numPiv] * mat[numPiv][j])) / pivAnt;
                        // Colocando 0 en la columna del pivote que no sea la fila pivote
                        matAct[i][numPiv] = 0;
                    }
                }
            }

            for (let k = 0; k < n; k++) {
                if (i === numPiv) {

                } else {
                    matAct[i + n][k] = ((mat[i + n][k] * pivAct) - (mat[i][numPiv] * mat[numPiv + n][k])) / pivAnt;
                }
            }
        }

        // Si no es la primera iteración, colocar el pivote en la posición (numPiv-1, numPiv-1)
        if (numPiv > 0) {
            for (let i = numPiv; i >= 0; i--) {
                matAct[numPiv - 1][numPiv - 1] = pivAct;
            }
        }

        // Actualizar `pivAnt` y `mat` para la siguiente iteración
        mat = [...matAct];

        // Mostrar la matriz después de cada paso
        let paso = document.createElement('h2');
        paso.textContent = `Paso ${numPiv + 1}:`;
        solution.appendChild(paso);
        let math = printMat(matAct);
        let h3 = document.createElement('h3');
        h3.textContent = `Piv. Ant: ${pivAnt}, Piv. Act: ${pivAct}`;
        math.appendChild(h3);
        solution.appendChild(document.createElement('br'));
        solution.appendChild(math);
        solution.appendChild(document.createElement('br'));
        matAct = [];
        pivAnt = pivAct;
        numPiv++;

        for (let i = 0; i < 2 * n; i++) {
            matAct.push([]);
        }
    }

    for (let i = 0; i < n; i++) {
        if (mat[i][i] == 0 || isNaN(mat[i][i])) { 
            let h4 = document.createElement('h4');
            h4.style.color = '#e0e0e0';
            h4.textContent = `No se puede resolver por este método`;
            solution.innerHTML = '';
            solution.appendChild(h4);
            console.error('No se puede resolver por este método');
            return;
            
        }
    }

    // Mostrar las soluciones
    for (let i = 0; i < n; i++) {
        matAdj.push([]);
        for (let j = 0; j < n; j++) {
            matAdj[i][j] = mat[i + n][j];
        }
    }

    for (let i = 0; i < n; i++) {
        matInv.push([]);
        for (let j = 0; j < n; j++) {
            matInv[i][j] = mat[i + n][j] / mat[0][0];
            let r = matInv[i][j];
            matInv[i][j] = r.toFixed(5);
        }
    }
    let h2 = document.createElement('h2');
    h2.textContent = "Las soluciones son: ";
    let div4 = document.createElement('div');
    div4.appendChild(h2);

    for (let i = 0; i < resp.length; i++) {
        let h3 = document.createElement('h3');
        let sol = 0;
        for (let j = 0; j < resp.length; j++) {
            sol += matInv[i][j] * resp[j];
        }
        sol = sol.toFixed(6);
        h3.textContent = `x${i} = ${sol}`;
        div4.appendChild(h3);
    }

    answers.appendChild(div4);

    let matAd = printMat(matAdj, 1);
    let matIn = printMat(matInv, 1);
    let div1 = document.createElement('div');
    let seeAdj = document.createElement('h3');
    seeAdj.textContent = 'La matriz adjunta es: ';
    div1.appendChild(seeAdj);
    div1.appendChild(matAd);
    answers.appendChild(div1);
    answers.appendChild(document.createElement('br'));
    let det = mat[0][0];
    let seeDet = document.createElement('h3');
    seeDet.textContent = `El determinante es ${det}`;
    let div2 = document.createElement('div');
    div2.appendChild(seeDet);
    answers.appendChild(div2);
    answers.appendChild(document.createElement('br'));
    let seeInv = document.createElement('h3');
    seeInv.textContent = 'La matriz inversa es: ';
    let div3 = document.createElement('div');
    div3.appendChild(seeInv);
    div3.appendChild(matIn);
    answers.appendChild(div3);

    console.log(matAct); // Mostrar la matriz final en consola
    mat = [];
}

// Función para verificar la diagonal principal de la matriz
function checkDiag(num) {
    let n;

    if (num == undefined) {
        n = getN();
    }else{
        n = num;
    }

    for (let i = 0; i < n; i++) {
        let chk = 0;

        for (let j = 0; j < n; j++) {
            if (mat[i][j] == 0) {
                chk++;
            }

            if (chk == n) {
                return 0;
            }
        }
    }

    for (let i = 0; i < n; i++) {
        let chk = 0;
    
        while (mat[i][i] == 0) {
            if (chk < n) {
                let temp = mat[i];
                mat[i] = mat[chk];
                mat[chk] = temp;
    
                let temp2 = mat[i + n];
                mat[i + n] = mat[chk + n];
                mat[chk + n] = temp2;
            }
    
            if (chk == n) {
                console.log(mat)
                console.log('Fallo al reacomodar la fila ' + i);
                return 0;
            }

            chk += 1;
        }

    }



    for (let i = 0; i < n; i++) {
        let chk = 0;
        if (mat[i][i] == 0 && chk < n) {
            checkDiag(n)
            chk += 1;
            console.log(chk)
        }
        
    }

    return 1;
}

// Función para imprimir la matriz en el DOM
function printMat(matrix, Adj) {
    let mat = matrix;
    let n = getN();
    let type = Adj;
    let math = document.createElement('math');
    let mrow = document.createElement('mrow');
    mrow.id = 'mrow';

    let mtable = document.createElement('mtable');
    let mtable2 = document.createElement('mtable');

    for (let i = 0; i < n; i++) {
        let mtr = document.createElement('mtr');

        for (let j = 0; j < n; j++) {
            let mtd = document.createElement('mtd');
            let mn = document.createElement('mn');

            mn.textContent = mat[i][j];
            mtd.appendChild(mn);
            mtr.appendChild(mtd);
        }

        mtable.appendChild(mtr);
    }

    if (type == undefined) {
        for (let i = n; i < 2 * n; i++) {
            let mtr = document.createElement('mtr');

            for (let j = 0; j < n; j++) {
                let mtd = document.createElement('mtd');
                let mn = document.createElement('mn');

                mn.textContent = mat[i][j];
                mtd.appendChild(mn);
                mtr.appendChild(mtd);
            }

            mtable2.appendChild(mtr);
        }
    }

    mrow.appendChild(mtable);
    mrow.appendChild(mtable2);

    math.appendChild(mrow);

    return math;
}