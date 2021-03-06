var er, ar, i, y, tx, mr, rt;
var dpp, c, dpa;
var loip, emi, eil, efemi;
var roi, pra, ipaid;
var rg, lg;

function addCoama(a) {
    a = parseFloat(a).toFixed(2);
    a = String(a);
    let ind = a.indexOf(".");
    if (a.length < 7)
        return "₹" + a;
    let abc = "," + a.slice(ind - 3, a.length);
    let j = ind - 3;
    for (; j > 2; j -= 2) {
        abc = "," + a.slice(j - 2, j) + abc;
    }
    return "₹" + a.slice(0, j) + abc;
}
window.addEventListener("load", function () {
    if (localStorage["er"]) {
        er = localStorage["er"];
        ar = localStorage["ar"];
        document.getElementById("r").innerHTML = "<br>Effective Rent: " + addCoama(er) + "<br>Annual Rent: " + addCoama(ar);
        tx = localStorage["tx"]
        mr = localStorage["mr"]
        document.getElementById("tx").value = tx;
        document.getElementById("mr").value = mr;
        document.getElementById("mro").value = addCoama(mr);
    }
    else {
        document.getElementById("mro").value = addCoama(0);
    }
    if (localStorage["i"]) {
        i = localStorage["i"];
        y = localStorage["y"];
        rt = localStorage["tr"];
        document.getElementById("ic").value = i;
        document.getElementById("y").value = y;
        document.getElementById("tr").innerHTML = "Total Rent: " + addCoama(rt);
        document.getElementById("ico").innerHTML = i + "%";
    }
    if (localStorage["c"]) {
        c = localStorage["c"];
        dpp = localStorage["dpp"];
        dpa = localStorage["dpa"];
        document.getElementById("co").value = c;
        document.getElementById("dpp").value = dpp;
        document.getElementById("da").innerHTML = "Downpayment amount: " + addCoama(dpa) + "<br>Loan amount: " + addCoama(c - dpa);
    }
    if (localStorage["loip"]) {
        loip = localStorage["loip"];
        emi = localStorage["emi"];
        eil = parseFloat(localStorage["eil"]);
        efemi = localStorage["efemi"];
        ipaid = localStorage["ipaid"];
        document.getElementById("int").value = loip;
        document.getElementById("loan").innerHTML = "Loan period is assumed to be " + y + " years<br>";
        document.getElementById("loan").innerHTML += "EMI: " + addCoama(emi);
        document.getElementById("loan").innerHTML += "<br>Your Income Tax Slab is: " + document.getElementById("tx").value + "%";
        document.getElementById("loan").innerHTML += "<br>Effective interest: " + eil.toFixed(2) + "%";
        document.getElementById("loan").innerHTML += "<br>Effective EMI: " + addCoama(efemi);
        document.getElementById("loan").innerHTML += "<br><br>Interest Paid: " + addCoama(efemi * y * 12 - (c - dpa));
    }
    if (localStorage["roi"]) {
        roi = localStorage["roi"];
        rg = localStorage["rg"];
        document.getElementById("ri").value = roi;
        hrc(1);
    }
    if (localStorage["pra"]) {
        pra = localStorage["pra"];
        lg = localStorage["lg"];
        document.getElementById("pv").value = pra;
        lrc(1);
    }
});
function efr() {
    if (!(document.getElementById("mr").value)) {
        return 0;
    }
    const r = document.getElementById("mr").value;
    const t = document.getElementById("tx").value;
    per = r * (1 - t / 100.0);
    par = per * 12;
    if (per == er && ar == par)
        return 1;
    document.getElementById("r").innerHTML = ""
    ar = par;
    er = per;
    document.getElementById("mro").value = addCoama(r);
    if (t != 0) {
        document.getElementById("r").innerHTML += "<br>Effective Rent: " + addCoama(er);
    }
    document.getElementById("r").innerHTML += "<br>Annual Rent: " + addCoama(ar);
    localStorage["mr"] = r;
    localStorage["tx"] = t;
    localStorage["er"] = er;
    localStorage["ar"] = ar;
    tr(0);
    return 2;
}

function FV(i, n, PV) {
    i = parseFloat(i);
    n = parseFloat(n);
    PV = parseFloat(PV);
    a = PV;
    for (j = 1; j < n; j++) {
        PV = PV * (1 + (i / 100.0));
        a += PV;
    }
    return a;
}

function tr(a) {
    if (!efr())
        return 0;
    const pi = document.getElementById("ic").value;
    const py = document.getElementById("y").value;
    if (!pi || !py)
        return 1;
    if ((pi == i && py == y) && (a != 0))
        return 2;
    i = pi;
    y = py;
    localStorage["i"] = i;
    localStorage["y"] = y;
    const tr = FV(i, y, ar);
    localStorage["tr"] = tr;
    document.getElementById("tr").innerHTML = "";
    document.getElementById("ico").innerHTML = i + "%";
    document.getElementById("tr").innerHTML = "Total Rent: " + addCoama(tr);
    la();
    hrc(1);
}

function la() {
    const pc = document.getElementById("co").value;
    const pdpp = document.getElementById("dpp").value;
    if (!pc || !pdpp)
        return 1;
    if (pc == c && dpp == pdpp)
        return 2;
    c = pc;
    dpp = pdpp;
    localStorage["c"] = c;
    localStorage["dpp"] = dpp;
    dpa = c - c * (1 - dpp / 100.0)
    localStorage["dpa"] = dpa;
    document.getElementById("da").innerHTML = "Downpayment amount: " + addCoama(dpa) + "<br>Loan amount: " + addCoama(c - dpa);
    interest(1);
}

function PMT(ir, np, pv) {
    let term = np * 12;
    ir = ir / 1200;
    let t = Math.pow((1 + ir), term);
    let b = t - 1;
    let ratio = t / b;
    return pv * ir * ratio;
}

function interest(a) {
    const ploip = document.getElementById("int").value;
    if (!ploip)
        return;
    if (ploip == loip && a != 1)
        return;
    loip = ploip;
    localStorage["loip"] = loip;
    if (!y) {
        alert("Please enter the number of years first");
        return;
    }
    o = document.getElementById("loan");
    o.innerHTML = "Loan period is assumed to be " + y + " years<br>";
    ir = loip;
    pv = c - dpa;
    pmt = PMT(ir, y, pv).toFixed(2);
    console.log(pv);
    o.innerHTML += "EMI: " + pmt;
    emi = pmt;
    localStorage["emi"] = emi;
    const t = document.getElementById("tx").value;
    o.innerHTML += "<br>Your Income Tax Slab is: " + t + "%";
    eil = loip * (1 - (t / 100.0));
    localStorage["eil"] = eil;
    o.innerHTML += "<br>Effective interest: " + eil.toFixed(2) + "%";
    efemi = PMT(eil, y, pv)
    localStorage["efemi"] = efemi;
    o.innerHTML += "<br>Effective EMI: " + addCoama(efemi);
    ipaid = (efemi * y * 12 - pv);
    localStorage["ipaid"] = ipaid;
    o.innerHTML += "<br><br>Interest Paid: " + addCoama(efemi * y * 12 - pv);
    hrc(1);
    lrc(1);
}


function hrc(a) {
    const proi = document.getElementById("ri").value;
    if (!proi)
        return;
    if (proi == roi && a != 1)
        return;
    roi = proi;
    localStorage["roi"] = roi;
    o = document.getElementById("hrcd");
    const h = (dpa * Math.pow(((400 + parseInt(roi)) / (400)), y * 4));
    const i = PMT(parseInt(roi), parseInt(y), parseInt(efemi - er) * 12 * 15) * y * 12;
    o.innerHTML = `If you will rent a house<br> Downpayment amount of ` + addCoama(dpa) + `
     and monthly expenditure of `+ addCoama(efemi - er) + ` will be saved`;
    o.innerHTML += `<br>If we assume the rate of growth to be ` + roi + `% then you will save `
        + h + ` as downpayement amount and ` +
        i + ` as emi amount ` + `so your net gain will be ` + addCoama(h + i - localStorage["tr"] + er * 12 * y);
    localStorage["rg"] = h + i - localStorage["tr"] + er * 12 * y;
    rg = localStorage["rg"];
    lrc(1);
}
function lrc(a) {
    const ppra = document.getElementById("pv").value;
    if (!ppra)
        return;
    if (ppra == pra && a != 1)
        return;
    pra = ppra;
    localStorage["pra"] = pra;
    o = document.getElementById("lrcd");
    o.innerHTML = `If we assume the raise in property cost to be ` + pra + "% then after " + y + `
     years your property will be valued at `+ addCoama(c * Math.pow(1 + (pra / 100), y)) + `
     So your net gain will be `+ addCoama(((parseInt(c)) * Math.pow(1 + (pra / 100.0), y)) - c - ipaid);
    localStorage["lg"] = (((parseInt(c)) * Math.pow(1 + (pra / 100.0), y)) - c - ipaid);
    lg = localStorage["lg"];
    des();
}
function des() {
    if (!lg || !rg)
        return;
    o = document.getElementById("decison");
    if (parseInt(rg) > parseInt(lg)) {
        o.innerHTML = "Renting a property would be a better option as you will gain " + addCoama(rg - lg) + `
        compared to buying the property`;
    }
    else if (parseInt(lg) > parseInt(rg)) {
        o.innerHTML = "Buying a property would be a better option as you will gain " + addCoama(lg - rg) + `
        compared to renting the property`;
    }
    else {
        o.innerHTML = "You can do anything as they both have equal return";
    }

}
