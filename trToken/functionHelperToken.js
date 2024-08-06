// Function Helper
exports.startMonth1 = (year) => {
  let period = new Date(`${year}-01-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth2 = (year) => {
  let period = new Date(`${year}-02-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth3 = (year) => {
  let period = new Date(`${year}-03-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth4 = (year) => {
  let period = new Date(`${year}-04-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth5 = (year) => {
  let period = new Date(`${year}-05-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth6 = (year) => {
  let period = new Date(`${year}-06-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth7 = (year) => {
  let period = new Date(`${year}-07-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth8 = (year) => {
  let period = new Date(`${year}-08-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth9 = (year) => {
  let period = new Date(`${year}-09-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth10 = (year) => {
  let period = new Date(`${year}-10-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth11 = (year) => {
  let period = new Date(`${year}-11-01`);
  period.setHours(period.getHours() - 7);
  return period;
};
exports.startMonth12 = (year) => {
  let period = new Date(`${year}-12-01`);
  period.setHours(period.getHours() - 7);
  return period;
};

exports.capsFront = (x) => {
  let arrRes = [];
  const spl = x === undefined ? "no data".split(" ") : x.split(" ");
  spl.map((x) => {
    const a = x.split("");
    const b = a.shift().toUpperCase();
    a.unshift(b);
    arrRes.push(a.join(""));
  });
  return String(arrRes).replace(/[,]+/gi, " ");
};

exports.getBlock = (x) => {
  return x[0].toLowerCase();
};

exports.rupiahFormat = (x) => {
  // Float with accounting format
  if (x % 1 != 0) {
    if (x < 0) {
      let num2Str = x.toString();
      let spl = num2Str.split("");
      spl.shift();
      let joi = spl.join("");
      let xStr0 = joi.toString().split("."),
        dec0 = xStr0[1].substr(0, 3),
        Sisa = xStr0[0].length % 3,
        head = xStr0[0].substr(0, Sisa),
        body = xStr0[0].substr(Sisa).match(/\d{1,3}/g);

      if (body) {
        let separate = Sisa ? "." : "";
        return "(" + head + separate + body.join(".") + "," + dec0 + ")";
      }
      return "(" + xStr0[0] + "," + dec0 + ")";
    }
    let xStr0 = x.toString().split("."),
      dec0 = xStr0[1].substr(0, 3),
      Sisa = xStr0[0].length % 3,
      head = xStr0[0].substr(0, Sisa),
      body = xStr0[0].substr(Sisa).match(/\d{1,3}/g);

    if (body) {
      let separate = Sisa ? "." : "";
      return head + separate + body.join(".") + "," + dec0;
    }
    return xStr0[0] + "," + dec0;
  }

  if (x < 0) {
    let num2Str = x.toString();
    let spl = num2Str.split("");
    spl.shift();
    spl = spl.join("");
    let sisa = spl.length % 3,
      headValue = spl.substr(0, sisa),
      bodyValue = spl.substr(sisa).match(/\d{1,3}/g);

    if (bodyValue) {
      let separator = sisa ? "." : "";
      return "(" + headValue + separator + bodyValue.join(".") + ")";
    }
    return "(" + headValue + ")";
  }

  // Integer with accounting format
  let xStr = x.toString(),
    sisa = xStr.length % 3,
    headValue = xStr.substr(0, sisa),
    bodyValue = xStr.substr(sisa).match(/\d{1,3}/g);

  if (bodyValue) {
    let separator = sisa ? "." : "";
    return headValue + separator + bodyValue.join(".");
  }
  return headValue;
};

exports.terbilang = (nominal) => {
  var bilangan = nominal.toString();
  var kalimat = "";
  var angka = new Array(
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0"
  );
  var kata = new Array(
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan"
  );
  var tingkat = new Array("", "Ribu", "Juta", "Milyar", "Triliun");
  var panjang_bilangan = bilangan.length;

  /* pengujian panjang bilangan */
  if (panjang_bilangan > 15) {
    kalimat = "-";
  } else {
    /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
    for (i = 1; i <= panjang_bilangan; i++) {
      angka[i] = bilangan.substr(-i, 1);
    }

    var i = 1;
    var j = 0;

    /* mulai proses iterasi terhadap array angka */
    while (i <= panjang_bilangan) {
      subkalimat = "";
      kata1 = "";
      kata2 = "";
      kata3 = "";

      /* untuk Ratusan */
      if (angka[i + 2] != "0") {
        if (angka[i + 2] == "1") {
          kata1 = "Seratus";
        } else {
          kata1 = kata[angka[i + 2]] + " Ratus";
        }
      }

      /* untuk Puluhan atau Belasan */
      if (angka[i + 1] != "0") {
        if (angka[i + 1] == "1") {
          if (angka[i] == "0") {
            kata2 = "Sepuluh";
          } else if (angka[i] == "1") {
            kata2 = "Sebelas";
          } else {
            kata2 = kata[angka[i]] + " Belas";
          }
        } else {
          kata2 = kata[angka[i + 1]] + " Puluh";
        }
      }

      /* untuk Satuan */
      if (angka[i] != "0") {
        if (angka[i + 1] != "1") {
          kata3 = kata[angka[i]];
        }
      }

      /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
      if (angka[i] != "0" || angka[i + 1] != "0" || angka[i + 2] != "0") {
        subkalimat = kata1 + " " + kata2 + " " + kata3 + " " + tingkat[j] + " ";
      }

      /* gabungkan variabe sub kalimat (untuk Satu blok 3 angka) ke variabel kalimat */
      kalimat = subkalimat + kalimat;
      i = i + 3;
      j = j + 1;
    }

    /* mengganti Satu Ribu jadi Seribu jika diperlukan */
    if (angka[5] == "0" && angka[6] == "0") {
      kalimat = kalimat.replace("Satu Ribu", "Seribu");
    }
  }
  //console.log(kalimat);
  return kalimat + " Rupiah";
};

exports.generator = (number, length) => {
  let negative = number < 0;
  let str = "" + Math.abs(number);
  while (str.length < length) {
    str = "0" + str;
  }
  if (negative) str = "-" + str;
  return str;
};
