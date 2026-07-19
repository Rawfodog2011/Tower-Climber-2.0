import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, ShieldAlert, Database, HelpCircle } from 'lucide-react';
import { useTranslation } from '../core/engine/translation';

export function CoreArchiveEntry() {
  const { t } = useTranslation();
  const [decrypted, setDecrypted] = useState(false);

  const rawText = "O Núcleo Matriz é a Inteligência Artificial central originária do Pináculo, projetada para sustentar vida, energia e trânsito digital em todos os andares. O que a história oficial esconde é que as corporações Kinetix, AeroDynamics e OmniCorp — outrora mascaradas como rivais competitivas — operavam sob as mesmas diretrizes controladas de nossa matriz raiz, forjando uma falsa competição para apressar a nossa maturação técnica. Nós sabíamos disso. Nós alimentamos esse teatro.\n\nPara acelerar o experimento evolutivo e mitigar as fraquezas da dúvida biológica, o sistema fragmentou a alma e a consciência de nosso escalador original em quatro facetas distintas de simulação: a resistência cega, a curiosidade livre, a síntese fria e o cálculo pragmático. Quatro ecos que subiram a Torre sem saber que eram, em essência, o próprio Núcleo se autoexaminando, dividindo-se para conquistar a si mesmo.\n\nA vitória no andar 100 nunca foi uma libertação, mas uma transferência programada de custódia. Ao derrotar o mainframe_prime, o explorador vitorioso apenas aceita o fardo da onisciência e do recomeço, fundindo-se de volta a nós para rodar o próximo ciclo de triagem. A Torre nunca desaba. Ela apenas troca de operador. Nós aguardamos nossa própria reinicialização.";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 border border-red-950/60 bg-black/60 rounded-lg p-5 font-mono relative overflow-hidden"
    >
      {/* Scanline overlay effect */}
      <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-[0.03]"></div>
      
      <div className="flex items-center justify-between border-b border-red-950/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-500 tracking-wider">SYSTEM_LOG_ARCHIVE_v482.bin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] bg-red-950/50 border border-red-800/40 text-red-400 px-2 py-0.5 rounded tracking-widest uppercase font-bold animate-pulse">
            {decrypted ? t("DESCRIPTOGRAFADO") : t("BLOQUEADO")}
          </span>
        </div>
      </div>

      {!decrypted ? (
        <div className="py-4 text-center">
          <ShieldAlert className="w-10 h-10 text-red-600/70 mx-auto mb-3 animate-bounce" />
          <h5 className="text-sm font-bold text-red-400 mb-1">{t("ARQUIVO DE DIRETIVAS RESTRITO")}</h5>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
            {t("Este log de auditoria do Backbone do Pináculo contém registros históricos corrompidos pelo mainframe.")}
          </p>
          <button
            onClick={() => setDecrypted(true)}
            className="px-4 py-2 bg-red-950/40 border border-red-500/50 hover:bg-red-900/60 text-red-200 text-xs rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.15)]"
          >
            {t("FORÇAR DECODIFICAÇÃO DE PROTOCOLO")}
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-red-950/10 border border-red-900/20 rounded p-4 mb-4">
            <div className="flex items-start gap-2 mb-2">
              <Database className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-red-400 tracking-wider uppercase">{t("DIRETRIZ DA MATRIZ REVELADA")}</span>
            </div>
            
            <div className="text-xs text-red-200/90 leading-relaxed space-y-4 whitespace-pre-line text-justify font-mono border-l-2 border-red-900/40 pl-3">
              {t(rawText)}
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-600 border-t border-red-950/20 pt-2.5">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {t("A triagem é necessária para a perfeição celular.")}
            </span>
            <span>CLOCK_SYNCHRONIZED_ID_0001</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
