
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UserHeader, SettingsSectionTitle, SettingsItem, DangerZone } from '../components/SettingsComponents';
import { Card } from '../components/DashboardComponents';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('lumpi_user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('lumpi_user');
    navigate('/login');
  };

  const exportUserData = async () => {
    if (!user) return;
    try {
      const [entradas, despesas, metas] = await Promise.all([
        supabase.from('entradas').select('*').eq('user_id', user.id),
        supabase.from('despesas').select('*').eq('user_id', user.id),
        supabase.from('metas').select('*').eq('user_id', user.id)
      ]);

      const fullData = {
        proprietario: user.nome,
        exportado_em: new Date().toISOString(),
        lgpd_status: "Conforme",
        relatorio: {
          entradas: entradas.data,
          despesas: despesas.data,
          metas: metas.data
        }
      };

      const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meus-dados-lumpi-${user.usuario || 'user'}.json`;
      link.click();
      alert('Relatório de Portabilidade gerado com sucesso!');
    } catch (e) {
      alert('Erro ao exportar dados.');
    }
  };

  const handleDeleteAllData = async () => {
    if (!user) return;
    const confirm = window.confirm("DIREITO AO ESQUECIMENTO: Isso excluirá todos os seus dados pessoais e financeiros permanentemente. Deseja continuar?");
    if (!confirm) return;

    setIsDeleting(true);
    try {
      await Promise.all([
        supabase.from('entradas').delete().eq('user_id', user.id),
        supabase.from('despesas').delete().eq('user_id', user.id),
        supabase.from('metas').delete().eq('user_id', user.id),
        supabase.from('manutencao').delete().eq('user_id', user.id),
        supabase.from('usuarios').delete().eq('id', user.id)
      ]);

      localStorage.removeItem('lumpi_user');
      alert('Seus dados foram excluídos com sucesso.');
      navigate('/login');
    } catch (e) {
      alert('Erro ao processar exclusão.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper placeholder click
  const handlePlaceholder = (feature: string) => {
    alert(`Funcionalidade "${feature}" será implementada em breve!`);
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-10 max-w-2xl mx-auto flex flex-col gap-2 pb-32">
      <h1 className="text-3xl font-black text-white px-2">Configurações</h1>

      <UserHeader
        name={user.nome || 'Motorista'}
        email={user.email || 'usuario@lumpi.app'}
        planLabel="Plano PRO"
        roleLabel="AdminVitalício"
      />

      <SettingsSectionTitle label="Conta" />
      <Card className="!p-0 overflow-hidden flex flex-col">
        <SettingsItem
          title="Meu Perfil"
          description="Nome, email e dados pessoais"
          iconName="person"
          onClick={() => handlePlaceholder('Meu Perfil')}
        />
        <SettingsItem
          title="Meu Veículo"
          description="Modelo, ano e consumo médio"
          iconName="directions_car"
          onClick={() => handlePlaceholder('Meu Veículo')}
        />
        <SettingsItem
          title="Segurança"
          description="Autenticação 2FA e senha"
          iconName="shield"
          onClick={() => handlePlaceholder('Segurança')}
        />
      </Card>

      <SettingsSectionTitle label="Gestão" />
      <Card className="!p-0 overflow-hidden flex flex-col">
        <SettingsItem
          title="Orçamentos"
          description="Limites de gastos por categoria"
          iconName="account_balance_wallet"
          onClick={() => handlePlaceholder('Orçamentos')}
        />
        <SettingsItem
          title="Manutenções"
          description="Registros e alertas de revisão"
          iconName="build"
          onClick={() => navigate('/maintenance')}
        />
        <SettingsItem
          title="Metas"
          description="Definir metas diárias e mensais"
          iconName="flag"
          onClick={() => navigate('/goals')}
        />
        <SettingsItem
          title="Relatórios"
          description="Exportar dados e análises (LGPD)"
          iconName="download"
          onClick={exportUserData}
        />
      </Card>

      <SettingsSectionTitle label="Comunidade" />
      <Card className="!p-0 overflow-hidden flex flex-col">
        <SettingsItem
          title="Ranking Semanal"
          description="Compare seu desempenho"
          iconName="trophy"
          onClick={() => navigate('/ranking')}
        />
        <SettingsItem
          title="Insígnias"
          description="Suas conquistas e medalhas"
          iconName="military_tech"
          onClick={() => handlePlaceholder('Insígnias')}
        />
        <SettingsItem
          title="Indicações"
          description="Ganhe meses grátis indicando"
          iconName="group_add"
          onClick={() => handlePlaceholder('Indicações')}
        />
      </Card>

      <SettingsSectionTitle label="Preferências" />
      <Card className="!p-0 overflow-hidden flex flex-col">
        <SettingsItem
          title="Notificações"
          description="Alertas de metas e lembretes"
          iconName="notifications"
          onClick={() => handlePlaceholder('Notificações')}
        />
        <SettingsItem
          title="Aparência"
          description="Tema automático (Dark/Light)"
          iconName="palette"
          rightElement={<span className="text-xs text-text-secondary font-bold px-2">Automático</span>}
        />
        <SettingsItem
          title="Privacidade"
          description="Política de privacidade e Termos"
          iconName="lock"
          onClick={() => handlePlaceholder('Privacidade')}
        />
      </Card>

      <DangerZone
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAllData}
      />

      <footer className="mt-8 text-center flex flex-col gap-1 pb-8">
        <p className="text-white font-bold text-sm">Controladora de Rentabilidade v1.0.0</p>
        <p className="text-text-secondary text-xs">Feito com ❤️ para motoristas</p>
      </footer>
    </div>
  );
};

export default Menu;
