// Variables globales para almacenar matrices y resultados
let inputs = []; //contiene los pares ordenados x y y
let Yinputs = [] //contienen los valores de x a evaluar

// Referencias a elementos del DOM
let divEc = document.getElementById('ecuaciones');
let seeMat = document.getElementById('seeMat');
let solution = document.getElementById('solution');

function crearEc() {
    let n = getN();

    // Validación del número de inputs
    if (!(/^\d+$/.test(n)) || n < 1) {
        alert('El número debe de ser un entero positivo');
        document.getElementById('n').value = '';
        return;
    }
    
    // Eliminar cualquier elemento del DOM que esté para poder ingresar los nuevos inputs
    clearEc();

    let button = document.createElement('button');
    button.type = 'button'; 
    button.textContent = 'Guardar';  // Botón para guardar los inputs
 
    // Crear campos de entrada para los inputs X y Y
    for (let i = 0; i < 2; i++) {
        let label = document.createElement('span');
        label.textContent = i === 0 ? 'X  ' : 'Y  ';
        divEc.appendChild(label);

        for (let j = 0; j < n; j++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.id = `x${i}${j}`;
            divEc.appendChild(input);
        }

        divEc.appendChild(document.createElement('br'));
    }

    // Espacio para entradas de valores de Y a evaluar
    divEc.appendChild(document.createElement('br'));
    let label = document.createElement('label');
    label.textContent = 'Ingrese de qué valor de Y desea saber su valor: ';
    divEc.appendChild(label);

    let valoresYDiv = document.createElement('div');  // Contenedor para múltiples entradas de Y
    divEc.appendChild(valoresYDiv);

    // Crear un primer campo de entrada de Y por defecto
    let yInput = document.createElement('input');
    yInput.type = 'number';
    yInput.id = `yinput0`;
    valoresYDiv.appendChild(yInput);
    valoresYDiv.appendChild(document.createElement('br'));

    let buttonadd = document.createElement('button');
    buttonadd.textContent = 'Añadir otro valor de Y';
    buttonadd.type = 'button';
    divEc.appendChild(buttonadd);

    let contY = 1;  // Contador para los inputs de Y (inicia en 1 por el campo por defecto)


    //Funcion para poder ingresar un nuevo valor de x a evaluar
    buttonadd.onclick = function() {
        let newYInput = document.createElement('input');
        newYInput.type = 'number';
        newYInput.id = `yinput${contY}`;
        valoresYDiv.appendChild(newYInput);
        valoresYDiv.appendChild(document.createElement('br'));
        contY++;
    };


    button.onclick = function() { saveIndex(n, contY); };//Pasamos como parametro a la función Solve n y ContY
    divEc.appendChild(button);
}



function saveIndex(n, contY) {
    // Vaciar el arreglo de los inputs cada vez que se ingresen unos nuevos
    inputs = []; 
    Yinputs = [];

    //Vaciamos contenedores por cualquier otra operacion que se pudo haber hecho antes.

    seeMat.innerHTML = '';
    solution.innerHTML = '';

    // Guardar los valores de los pares ordenados en el arreglo inputs
    for (let i = 0; i < 2; i++) {
        inputs[i] = []; 
        for (let j = 0; j < n; j++) {
            let value = document.getElementById(`x${i}${j}`).value;

            //Checar que todos los campos esten completos
            if (value === '' || isNaN(value)) {
                alert('Verifica que los campos estén correctamente completados');
                return;
            }

            // Verificar que todos los elementos de la primera fila (x) de inputs sean diferentes
            const uniqueXValues = new Set(inputs[0]); // Crear un conjunto con los valores de X
            if (uniqueXValues.size !== inputs[0].length) { //Si el conjunto de valores unicos y conjunto de las X ingresadas es de diferente tamaño entonces se ingresaron elementos repetidos en la primera fila
                alert('Los valores de X deben ser diferentes.');
                return;
            }

            inputs[i][j] = value; 
        }
    }


    // Guardar los valores de los Y a resolver en el arreglo Yinputs
    for (let i = 0; i <  contY; i++) {
        value = document.getElementById(`yinput${i}`).value;

        //Checar que todos los campos esten completos
        if (value === '' || isNaN(value)) {
            alert('Verifica que los campos estén correctamente completados');
            return;
        }
        Yinputs[i] = value;
    }

  
    console.log('Matriz de inputs: ', inputs);  // Imprime el arreglo de los inputs de pares ordenados
    console.log('Valores de Y a resolver', Yinputs);  // Imprime el arreglo de los inputs de y a resolver


    //Mostrar los pares ordenados ingresados
    inputs_math = printMat(inputs);
    seeMat.appendChild(inputs_math);

    seeMat.appendChild(document.createElement('br'))


    //Mostrar los valores de Y a resolver
    for (let i = 0; i <  contY; i++){
        Ylabel =document.createElement('span');
        Ylabel.textContent = `y (${Yinputs[i]}) = ?`
        seeMat.appendChild(Ylabel)
        seeMat.appendChild(document.createElement('br'))
    }


    //Mostar boton para resolver
    let btnSolve = document.createElement('button');
    btnSolve.type = 'button';
    btnSolve.textContent = 'Resolver';
    btnSolve.onclick =  function() { solve(n, contY); }; //Pasamos como parametro n y contY a la funcion Solve

    seeMat.appendChild(btnSolve);
}

// Función para limpiar los campos de entrada de ecuaciones
function clearEc() {
    divEc.innerHTML = '';
    seeMat.innerHTML = '';
    solution.innerHTML = '';
}

function solve(n, contY) {

    //Limpiamos el contenedor por si hubo problemas anteriores
    solution.innerHTML = '';

    seeMat.appendChild(document.createElement('br'));
    textFormula = document.createElement('span');
    textFormula.textContent = 'Formula de Lagrange: '
    seeMat.appendChild(textFormula);


    const yformula = formuladisplay(n); // Obtenemos la fórmula en codigo LaTeX
    const formulaDisplay = `\\[ ${yformula} \\]`; // Formato de bloque
    solution.innerHTML = formulaDisplay;


    // Llama a MathJax para procesar y renderizar la fórmula
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);


    solution.appendChild( document.createElement('br'));
    textSolution = document.createElement('span');
    textSolution.className = 'result'
    textSolution.textContent = 'Soluciones: '
    solution.appendChild(textSolution);
    solution.appendChild( document.createElement('br'));
    solution.appendChild(document.createElement('br'));

    //Calculo de y(x) para cada elemento de Yinputs
    for  (let i = 0; i < contY; i++){
        let resultY = solveY(Yinputs[i], n);
        console.log('Resultados X y Y', Yinputs[i], resultY);

        let Yresult = document.createElement('span');
        Yresult.className = 'result';
        Yresult.textContent = `y (${Yinputs[i]}) = ${resultY}`;
        
        //Mostrar solucion
        solution.appendChild(Yresult)
        solution.appendChild(document.createElement('br'));
        solution.appendChild(document.createElement('br'));
    }

}


function solveY(x, n) {
    let inputsX = inputs[0]; // Valores X
    let inputsY = inputs[1]; // Valores Y
    let result = 0; // Almacena el resultado final

    for (let i = 0; i < n; i++) {
        let termino = 1; // Resetea el término a 1 para cada i

        // Multiplica los factores de cada término
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                termino *= (x - inputsX[j]) / (inputsX[i] - inputsX[j]); // Factor de Lagrange
            }
        }

        result += termino * inputsY[i]; // Sumar el término multiplicado por Y en la posicion i
    }

    return result;
}



function formuladisplay(n) {
    let formula = 'y(x) = '; // Cadena para la fórmula
    let inputsX = inputs[0]; // Valores X
    let inputsY = inputs[1]; // Valores Y


    for (let i = 0; i < n; i++) {
        let factors = []; //arreglo que contiene los factores de los N terminos de la formula


        //agrega el j(i) como primer factor
        for (let j = 0; j < n; j++){
            if (i == j){
                factors.push(`${inputsY[j]}`);
            }
        }


        // Forma un arreglo con los factores del término i
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                factors.push(`\\frac{(x - ${inputsX[j]})}{(${inputsX[i]} - ${inputsX[j]})}`);
            }  
        }

        formula += factors.join(' \\cdot '); // Producto de los factores en LaTeX
        if (i < n - 1) {
            formula += ' + '; // Sumar las funciones de Lagrange
        }

    }
    return formula;
}


// Función para obtener el numero de pares ordenados ingresados
function getN() {
    let n = document.getElementById('n').value;
    n = parseInt(n);
    return n;
    
}


function printMat(array) {
    // Crear el contenedor de MathML
    let math = document.createElement('math');
    let mtable = document.createElement('mtable');

    // Crear la primera fila con el encabezado "X" seguido de los valores de la primera fila del array
    let mtr1 = document.createElement('mtr');
    
    let mtdX = document.createElement('mtd');
    let miX = document.createElement('mi');
    miX.textContent = 'X';
    mtdX.appendChild(miX);
    mtr1.appendChild(mtdX);

    for (let j = 0; j < array[0].length; j++) {
        let mtd = document.createElement('mtd');
        let mn = document.createElement('mn');
        mn.textContent = array[0][j];
        mtd.appendChild(mn);
        mtr1.appendChild(mtd);
    }

    // Crear la segunda fila con el encabezado "Y" seguido de los valores de la segunda fila del array
    let mtr2 = document.createElement('mtr');
    
    let mtdY = document.createElement('mtd');
    let miY = document.createElement('mi');
    miY.textContent = 'Y';
    mtdY.appendChild(miY);
    mtr2.appendChild(mtdY);

    for (let j = 0; j < array[1].length; j++) {
        let mtd = document.createElement('mtd');
        let mn = document.createElement('mn');
        mn.textContent = array[1][j];
        mtd.appendChild(mn);
        mtr2.appendChild(mtd);
    }

    // Añadir las filas a la tabla
    mtable.appendChild(mtr1);
    mtable.appendChild(mtr2);

    // Añadir la tabla a la estructura MathML
    math.appendChild(mtable);

    return math;
}
