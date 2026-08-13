
/* ══ diagnóstico: aislado, no depende de que el resto del script cargue bien ══ */
(function(){
"use strict";
try {

  function $(i){ return document.getElementById(i); }
  var R={}, et=1, reco=null;
  var ets=[null,$("e1"),$("e2"),$("e3"),$("e4")], marcas=document.querySelectorAll(".marca i");
  if(!ets[1]) return;

  var PLANES={
    persona:{t:"Plano personal",p:["Diagnóstico patrimonial completo","Protección: vida y gastos médicos mayores","Inversión por objetivo y plazo","PPR con beneficio fiscal"]},
    empresa:{t:"Plano empresarial",p:["Diagnóstico de riesgos de la operación","Gastos médicos colectivo para el equipo","Seguro de hombre clave","Plan de continuidad del negocio"]},
    ambos:{t:"Plano mixto",p:["Separar patrimonio personal y de la empresa","Protección en los dos frentes","Inversión con objetivo de retiro","Continuidad y sucesión"]}
  };
  var ACENTO={
    futuro:"Empezaríamos por el retiro: PPR y proyección a tu edad de salida.",
    riesgo:"Empezaríamos por blindar: vida y gastos médicos antes que cualquier inversión.",
    crecer:"Empezaríamos por poner a trabajar lo que ya tienes, con instrumentos por plazo.",
    orden:"Empezaríamos por ordenar: inventario de lo que tienes y en qué orden resolverlo."
  };

  function ir(k){
    ets.forEach(function(e,i){ if(e) e.classList.toggle("on",i===k); });
    marcas.forEach(function(m,i){ m.classList.toggle("on", i<=Math.min(k-1,3)); });
    et=k;
  }

  function arma(){
    var base=PLANES[R.q1]||PLANES.persona;
    reco=base;
    $("pTit").textContent=base.t;
    $("pSub").textContent=ACENTO[R.q2]||"";
    var extra = R.q3==="nada" ? "Arrancamos desde cero, en orden y sin prisa."
              : R.q3==="algo" ? "Primero conectamos lo que ya tienes; casi siempre sobra producto y falta estrategia."
              : "Optimización: revisamos costos, coberturas y rendimientos de lo que ya contrataste.";
    $("pLista").innerHTML=base.p.map(function(x){ return '<li><i>▲</i><span>'+x+'</span></li>'; }).join("")+
      '<li><i>▲</i><span>'+extra+'</span></li>';
  }

  document.querySelectorAll(".opc button").forEach(function(b){
    b.addEventListener("click",function(){
      R["q"+et]=b.getAttribute("data-v");
      if(et<3) ir(et+1); else { arma(); ir(4); }
    });
  });

  var formDiag=$("fDiag");
  if(formDiag && !formDiag.dataset.bound){
    formDiag.dataset.bound="1";

    formDiag.addEventListener("submit", function(ev){
      ev.preventDefault();
      ev.stopImmediatePropagation();

      var n=$("dNom").value.trim(), t=$("dTel").value.trim(), e=$("dErr"), btn=$("dEnv");
      if(!n){ e.textContent="Falta tu nombre."; $("dNom").focus(); return; }
      if(!t){ e.textContent="Falta tu WhatsApp."; $("dTel").focus(); return; }
      e.textContent="";

      $("hQ1").value = R.q1 || "";
      $("hQ2").value = R.q2 || "";
      $("hQ3").value = R.q3 || "";
      $("hReco").value = reco ? reco.t : "";

      btn.disabled=true; btn.textContent="Enviando…";

      var fd=new FormData(formDiag);
      var params=[];
      fd.forEach(function(v,k){ params.push(encodeURIComponent(k)+"="+encodeURIComponent(v)); });

      fetch("/", {
        method:"POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        body: params.join("&")
      })
      .then(function(res){
        if(!res.ok) throw new Error("bad status");
        formDiag.innerHTML =
          '<p style="font-family:var(--s);font-size:19px;font-weight:300;color:#fff;margin-bottom:8px">¡Listo, '+n+'!</p>'+
          '<p class="min" style="color:rgba(238,241,244,.7)">Recibimos tus datos. Te contactamos por WhatsApp en breve con tu plan.</p>';
      })
      .catch(function(){
        btn.disabled=false; btn.textContent="Recibir mi plan";
        e.textContent="Hubo un problema al enviar. Intenta de nuevo.";
      });
    });
  }

} catch(err) {
  console.error("Error en diagnóstico:", err);
}
})();
