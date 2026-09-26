import { Niche, BiositeTemplate } from '../types';

export const INITIAL_NICHES: (Omit<Niche, 'createdAt' | 'updatedAt'> & { slug: string })[] = [
  {
    id: 'barbearia',
    name: 'Barbearia',
    slug: 'barbearia',
    description: '',
    icon: 'Scissors',
    order: 1,
    active: true,
    modelCount: 1,
  },
  {
    id: 'beleza-estetica',
    name: 'Beleza & Estética',
    slug: 'beleza-estetica',
    description: '',
    icon: 'Sparkles',
    order: 2,
    active: true,
    modelCount: 1,
  },
  {
    id: 'gastronomia-delivery',
    name: 'Gastronomia & Delivery',
    slug: 'gastronomia-delivery',
    description: '',
    icon: 'Utensils',
    order: 3,
    active: true,
    modelCount: 1,
  },
  {
    id: 'loja-comercio',
    name: 'Loja & Comércio',
    slug: 'loja-comercio',
    description: '',
    icon: 'ShoppingBag',
    order: 4,
    active: true,
    modelCount: 1,
  },
  {
    id: 'formacao-academica',
    name: 'Formação Acadêmica',
    slug: 'formacao-academica',
    description: '',
    icon: 'GraduationCap',
    order: 5,
    active: true,
    modelCount: 1,
  },
  {
    id: 'servicos-profissionais',
    name: 'Serviços Profissionais',
    slug: 'servicos-profissionais',
    description: '',
    icon: 'Briefcase',
    order: 6,
    active: true,
    modelCount: 1,
  },
  {
    id: 'modelos-premium',
    name: 'Modelos Premium',
    slug: 'modelos-premium',
    description: '',
    icon: 'Crown',
    order: 7,
    active: true,
    modelCount: 1,
  },
  {
    id: 'modelos-chatbot',
    name: 'Modelos Chatbot',
    slug: 'modelos-chatbot',
    description: '',
    icon: 'Bot',
    order: 8,
    active: true,
    modelCount: 1,
  },
  {
    id: 'saude-bem-estar',
    name: 'Saúde & Bem-Estar',
    slug: 'saude-bem-estar',
    description: '',
    icon: 'HeartPulse',
    order: 9,
    active: true,
    modelCount: 1,
  },
  {
    id: 'portfolio-criadores',
    name: 'Portfólio & Criadores',
    slug: 'portfolio-criadores',
    description: '',
    icon: 'Palette',
    order: 10,
    active: true,
    modelCount: 1,
  },
];

// =========================================================================
// 1. BARBEARIA LUXO TITANIUM
// =========================================================================
const TEMPLATE_BARBEARIA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Black Crown Barber Club</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #08080c; color: #e5e5e5; min-height: 100vh; display: flex; justify-content: center; padding: 24px 12px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 24px; position: relative; }
    .logo-wrapper { width: 100px; height: 100px; margin: 0 auto 16px; position: relative; border-radius: 24px; padding: 3px; background: linear-gradient(135deg, #d97706, #9333ea, #d97706); box-shadow: 0 8px 30px rgba(217, 119, 6, 0.35); }
    .logo-img { width: 100%; height: 100%; object-fit: contain; border-radius: 20px; background: #121118; padding: 8px; border: 2px solid #222030; }
    .company-name { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.5px; margin-bottom: 6px; text-transform: uppercase; }
    .headline { font-size: 15px; font-weight: 700; color: #fbbf24; letter-spacing: 0.5px; margin-bottom: 6px; }
    .subtitulo { font-size: 13px; color: #9ca3af; line-height: 1.5; padding: 0 8px; }
    
    .social-bar { display: flex; justify-content: center; gap: 12px; margin: 20px 0; }
    .social-btn { width: 44px; height: 44px; border-radius: 12px; background: #14131d; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .social-btn:hover { border-color: #f59e0b; transform: translateY(-2px); }
    
    .cta-main { display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-weight: 700; font-size: 15px; margin-bottom: 20px; box-shadow: 0 8px 25px -4px rgba(34, 197, 94, 0.45); text-align: center; }
    
    .section-header { font-size: 13px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1.5px; margin: 22px 0 12px; display: flex; align-items: center; justify-content: space-between; }
    .section-header span { background: rgba(251,191,36,0.1); padding: 3px 8px; border-radius: 6px; font-size: 11px; }

    .specialties-grid { display: flex; flex-direction: column; gap: 10px; }
    .specialty-card { display: flex; gap: 12px; background: #12111a; border: 1px solid #222030; border-radius: 16px; padding: 12px; transition: all 0.2s; }
    .specialty-card:hover { border-color: #f59e0b; }
    .specialty-img { width: 68px; height: 68px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
    .specialty-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .specialty-top { display: flex; justify-content: space-between; align-items: baseline; }
    .specialty-name { font-weight: 700; color: #fff; font-size: 15px; }
    .specialty-price { font-weight: 800; color: #fbbf24; font-size: 14px; }
    .specialty-desc { font-size: 12px; color: #888698; margin-top: 3px; line-height: 1.3; }

    .gallery-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
    .gallery-img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); transition: transform 0.2s; }
    .gallery-img:hover { transform: scale(1.03); }

    .info-card { background: #12111a; border: 1px solid #222030; border-radius: 16px; padding: 16px; margin-bottom: 14px; font-size: 13px; color: #d1d5db; line-height: 1.6; }
    .info-card b { color: #fff; }
    
    .google-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background: #181724; border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; padding: 12px; text-decoration: none; color: #fff; font-weight: 600; font-size: 13px; margin-bottom: 20px; transition: all 0.2s; }
    .google-btn:hover { background: #222032; border-color: #4285f4; }
    .google-stars { color: #fbbc05; font-size: 15px; }

    .footer { text-align: center; padding: 20px 0; font-size: 11px; color: #525062; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-wrapper">
        <img class="logo-img" data-bio-image="logo" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80" alt="Black Crown Barber Club">
      </div>
      <h1 class="company-name" data-bio-text="nome_empresa">BLACK CROWN BARBER CLUB</h1>
      <div class="headline" data-bio-text="headline">SEU ESTILO COMEÇA AQUI.</div>
      <p class="subtitulo" data-bio-text="subtitulo">Precisão, personalidade e cuidado em cada detalhe.</p>
    </div>

    <div class="social-bar">
      <a href="https://instagram.com/blackcrownbarber" target="_blank" class="social-btn" data-bio-link="instagram" title="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
      <a href="https://maps.app.goo.gl/barber" target="_blank" class="social-btn" data-bio-link="maps" title="Localização">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      </a>
      <a href="tel:+5531999999999" class="social-btn" data-bio-link="telefone" title="Ligar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </a>
    </div>

    <a href="https://wa.me/5531999999999?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20BLACK%20CROWN%20BARBER%20CLUB%20e%20gostaria%20de%20agendar%20meu%20hor%C3%A1rio." target="_blank" class="cta-main" data-bio-link="whatsapp">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.822 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm7.42 5.766c-.001 4.093-3.328 7.42-7.42 7.42-.001 0-.001 0 0 0-1.282 0-2.457-.333-3.528-.941l-4.148 1.088 1.107-4.043c-.694-1.121-1.066-2.42-1.066-3.754 0-4.092 3.327-7.419 7.42-7.419 4.092 0 7.419 3.327 7.419 7.42 0 0 0 0 0 0z"/></svg>
      <span>AGENDAR HORÁRIO NO WHATSAPP</span>
    </a>

    <!-- Especialidades -->
    <div class="section-header">
      <b>Especialidades</b>
      <span>6 serviços</span>
    </div>
    <div class="specialties-grid">
      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_1_foto" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80" alt="Corte">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_1_nome">Corte</span>
            <span class="specialty-price" data-bio-text="esp_1_preco">R$ 55</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_1_desc">Clássico ou moderno, executado com precisão.</p>
        </div>
      </div>

      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_2_foto" src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&auto=format&fit=crop&q=80" alt="Barba">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_2_nome">Barba</span>
            <span class="specialty-price" data-bio-text="esp_2_preco">R$ 45</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_2_desc">Alinhamento perfeito, toalha quente e massagem facial.</p>
        </div>
      </div>

      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_3_foto" src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&auto=format&fit=crop&q=80" alt="Luzes">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_3_nome">Luzes</span>
            <span class="specialty-price" data-bio-text="esp_3_preco">R$ 90</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_3_desc">Platinado ou degradê com descoloração controlada.</p>
        </div>
      </div>
    </div>

    <!-- Google Review Button -->
    <a href="https://g.page/r/blackcrown/review" target="_blank" class="google-btn" data-bio-link="google_review" style="margin-top: 18px;">
      <span class="google-stars">★★★★★</span>
      <span>Avalie-nos no Google (4.9 / 5.0)</span>
    </a>

    <!-- Localização & Horário -->
    <div class="section-header">
      <b>Localização & Atendimento</b>
    </div>
    <div class="info-card">
      <p>📍 <b>Endereço:</b> <span data-bio-text="endereco">Av. Imperial, 725 — Centro — Belo Horizonte/MG</span></p>
      <p style="margin-top: 8px;">⏰ <b>Horário:</b> <span data-bio-text="horario">Terça a Sábado: 09h às 20h</span></p>
    </div>

    <div class="footer">
      <p>© <span data-bio-text="nome_empresa">BLACK CROWN BARBER CLUB</span> · Todos os direitos reservados</p>
    </div>
  </div>
</body>
</html>`;

// =========================================================================
// 2. BELEZA & ESTÉTICA VIP
// =========================================================================
const TEMPLATE_ESTETICA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dra. Camila Vasconcelos | Estética Avançada</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #0e0d11; color: #f3f3f5; min-height: 100vh; display: flex; justify-content: center; padding: 24px 14px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 24px; }
    .avatar-wrapper { width: 110px; height: 110px; margin: 0 auto 16px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #f472b6, #fb7185, #ec4899); box-shadow: 0 0 25px rgba(244, 114, 182, 0.4); }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid #0e0d11; }
    .title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .cr { font-size: 12px; color: #f472b6; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .bio { font-size: 14px; color: #9ca3af; line-height: 1.5; padding: 0 8px; }
    
    .cta-main { display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, #ec4899, #be185d); color: #fff; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-weight: 700; font-size: 15px; margin-top: 18px; margin-bottom: 20px; box-shadow: 0 8px 24px -4px rgba(236, 72, 153, 0.5); }
    
    .card-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .link-card { background: rgba(26, 24, 32, 0.85); border: 1px solid rgba(244, 114, 182, 0.2); border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; color: #fff; text-decoration: none; transition: all 0.2s; }
    .link-card:hover { border-color: #f472b6; transform: translateY(-2px); }
    .link-title { font-weight: 600; font-size: 15px; }
    .link-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }
    .arrow { color: #f472b6; font-size: 18px; }

    .location-box { background: rgba(26, 24, 32, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px; font-size: 13px; color: #9ca3af; line-height: 1.4; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="avatar-wrapper">
        <img class="avatar-img" data-bio-image="avatar" src="https://images.unsplash.com/photo-1594824813576-71d37452d3a3?w=300&auto=format&fit=crop&q=80" alt="Dra. Camila">
      </div>
      <h1 class="title" data-bio-text="nome_profissional">Dra. Camila Vasconcelos</h1>
      <div class="cr" data-bio-text="registro_profissional">CRBM 18.420 · Harmonização Facial & Corporal</div>
      <p class="bio" data-bio-text="bio_descricao">Realçando sua beleza natural com segurança, tecnologia e procedimentos minimamente invasivos.</p>
    </div>

    <a href="https://wa.me/5511999999999?text=Olá%20Dra.%20Camila,%20gostaria%20de%20agendar%20uma%20avaliação!" target="_blank" class="cta-main" data-bio-link="whatsapp">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.822 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm7.42 5.766c-.001 4.093-3.328 7.42-7.42 7.42-.001 0-.001 0 0 0-1.282 0-2.457-.333-3.528-.941l-4.148 1.088 1.107-4.043c-.694-1.121-1.066-2.42-1.066-3.754 0-4.092 3.327-7.419 7.42-7.419 4.092 0 7.419 3.327 7.419 7.42 0 0 0 0 0 0z"/></svg>
      <span data-bio-text="cta_texto">Agendar Avaliação Personalizada</span>
    </a>

    <div class="card-list">
      <a href="https://wa.me/5511999999999" class="link-card" data-bio-link="link_botox">
        <div>
          <div class="link-title" data-bio-text="procedimento_1_nome">Toxina Botulínica (Botox)</div>
          <div class="link-sub" data-bio-text="procedimento_1_desc">Prevenção e suavização de linhas de expressão</div>
        </div>
        <span class="arrow">→</span>
      </a>

      <a href="https://wa.me/5511999999999" class="link-card" data-bio-link="link_preenchimento">
        <div>
          <div class="link-title" data-bio-text="procedimento_2_nome">Preenchimento Labial & Malar</div>
          <div class="link-sub" data-bio-text="procedimento_2_desc">Contorno labial anatômico e hidratação profunda</div>
        </div>
        <span class="arrow">→</span>
      </a>

      <a href="https://wa.me/5511999999999" class="link-card" data-bio-link="link_bioestimuladores">
        <div>
          <div class="link-title" data-bio-text="procedimento_3_nome">Bioestimuladores de Colágeno</div>
          <div class="link-sub" data-bio-text="procedimento_3_desc">Firmeza e rejuvenescimento duradouro</div>
        </div>
        <span class="arrow">→</span>
      </a>
    </div>

    <div class="location-box">
      <p>📍 <span data-bio-text="endereco_completo">Edifício Prime Medical · Rua Oscar Freire, 920 - Jardins, SP</span></p>
    </div>
  </div>
</body>
</html>`;

// =========================================================================
// 3. GASTRONOMIA & DELIVERY
// =========================================================================
const TEMPLATE_RESTAURANTE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Burger & Beer Experience</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #070709; color: #ececf1; min-height: 100vh; display: flex; justify-content: center; padding: 20px 12px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .banner { width: 100%; height: 160px; border-radius: 20px; overflow: hidden; position: relative; margin-bottom: -40px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); }
    .banner img { width: 100%; height: 100%; object-fit: cover; }
    .profile-area { position: relative; text-align: center; margin-bottom: 20px; }
    .avatar { width: 84px; height: 84px; border-radius: 50%; border: 3px solid #ff5722; margin: 0 auto 10px; object-fit: cover; box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4); }
    .title { font-size: 22px; font-weight: 800; color: #fff; }
    .subtitle { font-size: 13px; color: #ff7043; font-weight: 600; margin-top: 2px; }
    
    .btn-action { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 12px; transition: transform 0.2s; }
    .btn-action:hover { transform: translateY(-2px); }
    .btn-whatsapp { background: linear-gradient(135deg, #25D366, #128C7E); color: #fff; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35); }
    .btn-cardapio { background: #1a1924; border: 1px solid rgba(255, 87, 34, 0.3); color: #fff; }
    .btn-cardapio:hover { border-color: #ff5722; }

    .info-box { background: #12111a; border: 1px solid #201f2e; border-radius: 16px; padding: 14px; margin-top: 14px; font-size: 13px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="banner">
      <img data-bio-image="banner" src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80" alt="Banner">
    </div>
    <div class="profile-area">
      <img class="avatar" data-bio-image="avatar" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80" alt="Logo">
      <h1 class="title" data-bio-text="nome_restaurante">The Burger Experience</h1>
      <p class="subtitle" data-bio-text="slogan_restaurante">Smash Burgers · Carnes Nobres · Chope Artesanal</p>
    </div>

    <a href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20fazer%20um%20pedido!" target="_blank" class="btn-action btn-whatsapp" data-bio-link="whatsapp">
      <span data-bio-text="cta_whatsapp">Fazer Pedido no WhatsApp</span>
    </a>

    <a href="https://example.com/cardapio" target="_blank" class="btn-action btn-cardapio" data-bio-link="cardapio_online">
      <span>📖 Ver Cardápio Digital Completo</span>
    </a>

    <div class="info-box">
      <p>📍 <span data-bio-text="endereco">Rua Gastronômica, 420 - Batel</span></p>
      <p style="margin-top: 6px;">⏰ <span data-bio-text="horario">Quarta a Domingo, das 18h às 23h30</span></p>
    </div>
  </div>
</body>
</html>`;

// =========================================================================
// 4. LOJA & COMÉRCIO CONCEPT STORE
// =========================================================================
const TEMPLATE_LOJA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urban Concept Store</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #0a0910; color: #f1f1f5; min-height: 100vh; display: flex; justify-content: center; padding: 24px 12px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .brand-header { text-align: center; margin-bottom: 20px; }
    .brand-badge { width: 90px; height: 90px; margin: 0 auto 12px; border-radius: 20px; border: 2px solid #8b5cf6; object-fit: cover; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35); }
    .brand-title { font-size: 22px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 1px; }
    .brand-desc { font-size: 13px; color: #a78bfa; margin-top: 4px; }

    .promo-banner { background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 14px; border-radius: 14px; text-align: center; color: #fff; font-weight: 700; font-size: 13px; margin-bottom: 18px; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3); }
    
    .btn-buy { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 15px; border-radius: 14px; font-weight: 700; font-size: 14px; text-decoration: none; margin-bottom: 12px; transition: transform 0.2s; }
    .btn-buy:hover { transform: translateY(-2px); }
    .btn-primary { background: #22c55e; color: #fff; }
    .btn-secondary { background: #181628; border: 1px solid rgba(255,255,255,0.1); color: #fff; }

    .products-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; margin-bottom: 20px; }
    .product-card { background: #131122; border: 1px solid #25223c; border-radius: 14px; overflow: hidden; padding: 10px; text-align: center; }
    .product-img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 10px; margin-bottom: 8px; }
    .product-name { font-size: 13px; font-weight: 700; color: #fff; }
    .product-price { font-size: 12px; color: #a78bfa; font-weight: 800; margin-top: 2px; }

    .footer { text-align: center; font-size: 11px; color: #6b7280; padding: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand-header">
      <img class="brand-badge" data-bio-image="logo" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop&q=80" alt="Loja">
      <h1 class="brand-title" data-bio-text="nome_loja">URBAN STYLE STORE</h1>
      <p class="brand-desc" data-bio-text="subtitulo">Moda Streetwear & Tendências Exclusivas</p>
    </div>

    <div class="promo-banner" data-bio-text="banner_promo">
      🔥 FRETE GRÁTIS nas compras acima de R$ 199 com o cupom BIOFACIL
    </div>

    <a href="https://wa.me/5511999999999" class="btn-buy btn-primary" data-bio-link="whatsapp">
      <span>FALAR COM CONSULTOR DE VENDAS</span>
    </a>

    <a href="https://instagram.com" class="btn-buy btn-secondary" data-bio-link="catalogo">
      <span>VER CATÁLOGO & LANÇAMENTOS</span>
    </a>

    <div class="products-grid">
      <div class="product-card">
        <img class="product-img" data-bio-image="prod_1" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80" alt="T-Shirt">
        <div class="product-name" data-bio-text="prod_1_nome">Camiseta Oversized Minimal</div>
        <div class="product-price" data-bio-text="prod_1_preco">R$ 119,90</div>
      </div>
      <div class="product-card">
        <img class="product-img" data-bio-image="prod_2" src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80" alt="Hoodie">
        <div class="product-name" data-bio-text="prod_2_nome">Moletom Heavyweight Dark</div>
        <div class="product-price" data-bio-text="prod_2_preco">R$ 249,90</div>
      </div>
    </div>

    <div class="footer">
      <p>© <span data-bio-text="nome_loja">URBAN STYLE STORE</span> · Enviamos para todo o Brasil</p>
    </div>
  </div>
</body>
</html>`;

// =========================================================================
// 5. FORMAÇÃO ACADÊMICA & MENTORIA
// =========================================================================
const TEMPLATE_MENTORIA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Academia & Mentoria High Level</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #070913; color: #f3f4f6; min-height: 100vh; display: flex; justify-content: center; padding: 24px 12px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .mentor-header { text-align: center; margin-bottom: 22px; }
    .mentor-avatar { width: 104px; height: 104px; border-radius: 50%; border: 3px solid #38bdf8; margin: 0 auto 14px; object-fit: cover; box-shadow: 0 6px 25px rgba(56, 189, 248, 0.35); }
    .mentor-name { font-size: 22px; font-weight: 800; color: #fff; }
    .mentor-title { font-size: 13px; color: #38bdf8; font-weight: 600; margin-top: 4px; }
    .mentor-bio { font-size: 13px; color: #94a3b8; margin-top: 8px; line-height: 1.5; padding: 0 10px; }

    .cta-course { display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; padding: 16px; border-radius: 14px; font-weight: 700; font-size: 15px; text-decoration: none; margin-bottom: 14px; box-shadow: 0 8px 24px rgba(2, 132, 199, 0.4); text-align: center; }

    .module-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; padding: 14px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; text-decoration: none; color: #fff; }
    .module-card:hover { border-color: #38bdf8; }
    .module-name { font-size: 14px; font-weight: 700; }
    .module-desc { font-size: 12px; color: #64748b; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="mentor-header">
      <img class="mentor-avatar" data-bio-image="avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" alt="Mentor">
      <h1 class="mentor-name" data-bio-text="nome_mentor">Prof. André Alcantara</h1>
      <p class="mentor-title" data-bio-text="especialidade">Especialista em Gestão e Alta Performance</p>
      <p class="mentor-bio" data-bio-text="bio">Capacitando mais de 5.000 profissionais com metodologias validadas pelo mercado.</p>
    </div>

    <a href="https://wa.me/5511999999999" class="cta-course" data-bio-link="inscricao">
      <span data-bio-text="cta_texto">INSCREVER-SE NA FORMAÇÃO 2026</span>
    </a>

    <a href="https://example.com" class="module-card" data-bio-link="modulo_1">
      <div>
        <div class="module-name" data-bio-text="curso_1_nome">Masterclass: Liderança Executiva</div>
        <div class="module-desc" data-bio-text="curso_1_desc">Aulas práticas, materiais em PDF e certificação</div>
      </div>
      <span>→</span>
    </a>

    <a href="https://example.com" class="module-card" data-bio-link="modulo_2">
      <div>
        <div class="module-name" data-bio-text="curso_2_nome">Comunidade VIP & Network</div>
        <div class="module-desc" data-bio-text="curso_2_desc">Encontros quinzenais e mentoria direta</div>
      </div>
      <span>→</span>
    </a>
  </div>
</body>
</html>`;

// =========================================================================
// 6. SERVIÇOS PROFISSIONAIS & ADVOCACIA
// =========================================================================
const TEMPLATE_ADVOCACIA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Castro Advocacia & Consultoria</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #0c0b10; color: #f3f4f6; min-height: 100vh; display: flex; justify-content: center; padding: 24px 14px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .firm-header { text-align: center; margin-bottom: 24px; }
    .firm-logo { width: 88px; height: 88px; margin: 0 auto 14px; border-radius: 18px; border: 2px solid #ca8a04; object-fit: cover; box-shadow: 0 4px 20px rgba(202, 138, 4, 0.3); }
    .firm-name { font-size: 21px; font-weight: 900; color: #fff; letter-spacing: 0.5px; }
    .firm-oab { font-size: 12px; color: #eab308; font-weight: 700; margin-top: 4px; text-transform: uppercase; }
    .firm-desc { font-size: 13px; color: #9ca3af; margin-top: 6px; line-height: 1.5; }

    .btn-contact { display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, #ca8a04, #a16207); color: #fff; padding: 16px; border-radius: 14px; font-weight: 800; font-size: 14px; text-decoration: none; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(202, 138, 4, 0.35); text-align: center; }

    .service-item { background: #161520; border: 1px solid #282638; border-radius: 14px; padding: 14px; margin-bottom: 10px; }
    .service-title { font-size: 14px; font-weight: 700; color: #fff; }
    .service-desc { font-size: 12px; color: #888698; margin-top: 3px; }

    .address-card { background: #12111a; border: 1px solid #201e30; border-radius: 14px; padding: 14px; margin-top: 14px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="firm-header">
      <img class="firm-logo" data-bio-image="logo" src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80" alt="Logo">
      <h1 class="firm-name" data-bio-text="nome_escritorio">CASTRO & ASSOCIADOS</h1>
      <p class="firm-oab" data-bio-text="registro_oab">OAB/SP 142.890 · Advocacia & Consultoria Estratégica</p>
      <p class="firm-desc" data-bio-text="descricao">Atuação consultiva e contenciosa com excelência, ética e foco em resultados ágeis.</p>
    </div>

    <a href="https://wa.me/5511999999999" class="btn-contact" data-bio-link="whatsapp">
      <span>AGENDAR CONSULTA COM ADVOGADO</span>
    </a>

    <div class="service-item">
      <div class="service-title" data-bio-text="area_1_nome">Direito Empresarial & Contratos</div>
      <div class="service-desc" data-bio-text="area_1_desc">Blindagem jurídica e estruturação societária</div>
    </div>

    <div class="service-item">
      <div class="service-title" data-bio-text="area_2_nome">Direito Imobiliário & Regularização</div>
      <div class="service-desc" data-bio-text="area_2_desc">Segurança patrimonial e transações imobiliárias</div>
    </div>

    <div class="address-card">
      <p>📍 <span data-bio-text="endereco">Av. Paulista, 1578 — Bela Vista — São Paulo/SP</span></p>
    </div>
  </div>
</body>
</html>`;

// =========================================================================
// 7. MODELOS PREMIUM
// =========================================================================
const TEMPLATE_PREMIUM_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Black & Gold VIP Experience</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #050507; color: #f5f5f7; min-height: 100vh; display: flex; justify-content: center; padding: 26px 14px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; text-align: center; }
    .vip-badge { width: 94px; height: 94px; margin: 0 auto 16px; border-radius: 24px; padding: 2px; background: linear-gradient(135deg, #f59e0b, #eab308, #b45309); box-shadow: 0 0 30px rgba(245, 158, 11, 0.4); }
    .vip-img { width: 100%; height: 100%; object-fit: cover; border-radius: 22px; }
    .vip-title { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
    .vip-tag { font-size: 12px; color: #fbbf24; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
    
    .vip-cta { display: block; background: linear-gradient(135deg, #d97706, #b45309); color: #fff; padding: 16px; border-radius: 16px; font-weight: 800; font-size: 15px; text-decoration: none; margin: 20px 0; box-shadow: 0 8px 30px rgba(217, 119, 6, 0.45); }
    
    .perks-card { background: #111018; border: 1px solid #2a2538; border-radius: 16px; padding: 16px; text-align: left; margin-bottom: 12px; }
    .perk-title { font-size: 14px; font-weight: 700; color: #fbbf24; }
    .perk-desc { font-size: 12px; color: #9ca3af; margin-top: 3px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="vip-badge">
      <img class="vip-img" data-bio-image="avatar" src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80" alt="VIP">
    </div>
    <h1 class="vip-title" data-bio-text="titulo_vip">THE BLACK & GOLD CLUB</h1>
    <p class="vip-tag" data-bio-text="subtitulo_vip">EXPERIÊNCIAS & BENEFÍCIOS EXCLUSIVOS</p>

    <a href="https://wa.me/5511999999999" class="vip-cta" data-bio-link="whatsapp">
      <span>SOLICITAR ACESSO EXCLUSIVO</span>
    </a>

    <div class="perks-card">
      <div class="perk-title" data-bio-text="beneficio_1_nome">💎 Atendimento Concierge 24/7</div>
      <div class="perk-desc" data-bio-text="beneficio_1_desc">Canal direto para solicitações especiais e reservas</div>
    </div>
    <div class="perks-card">
      <div class="perk-title" data-bio-text="beneficio_2_nome">🎟 Convites para Eventos VIP</div>
      <div class="perk-desc" data-bio-text="beneficio_2_desc">Acesso restrito aos melhores encontros corporativos</div>
    </div>
  </div>
</body>
</html>`;

// =========================================================================
// 8. MODELOS CHATBOT
// =========================================================================
const TEMPLATE_CHATBOT_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmartBot Atendimento</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #080912; color: #e2e8f0; min-height: 100vh; display: flex; justify-content: center; padding: 24px 12px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; text-align: center; }
    .bot-icon { width: 88px; height: 88px; margin: 0 auto 14px; border-radius: 24px; background: linear-gradient(135deg, #06b6d4, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 38px; box-shadow: 0 0 25px rgba(6, 182, 212, 0.4); }
    .bot-name { font-size: 22px; font-weight: 800; color: #fff; }
    .bot-status { font-size: 12px; color: #22c55e; font-weight: 700; margin-top: 4px; display: inline-flex; align-items: center; gap: 6px; }
    
    .chat-bubble { background: #131728; border: 1px solid #1e293b; border-radius: 16px; padding: 14px; text-align: left; margin: 18px 0; font-size: 13px; color: #cbd5e1; line-height: 1.5; }
    
    .btn-channel { display: flex; align-items: center; justify-content: space-between; background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; padding: 14px 16px; text-decoration: none; color: #fff; font-weight: 600; font-size: 14px; margin-bottom: 10px; transition: all 0.2s; }
    .btn-channel:hover { border-color: #38bdf8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="bot-icon">🤖</div>
    <h1 class="bot-name" data-bio-text="nome_bot">SmartBot Atendimento</h1>
    <div class="bot-status"><span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e;"></span> Online agora · Resposta imediata</div>

    <div class="chat-bubble" data-bio-text="mensagem_boas_vindas">
      Olá! Eu sou o assistente virtual do seu negócio. Escolha uma opção abaixo para ser direcionado rapidamente:
    </div>

    <a href="https://wa.me/5511999999999?text=Quero%20um%20orcamento" class="btn-channel" data-bio-link="canal_orcamento">
      <span data-bio-text="opcao_1">1. Solicitar Orçamento Imediato</span>
      <span>→</span>
    </a>

    <a href="https://wa.me/5511999999999?text=Tirar%20duvidas" class="btn-channel" data-bio-link="canal_duvidas">
      <span data-bio-text="opcao_2">2. Dúvidas Frequentes & Suporte</span>
      <span>→</span>
    </a>
  </div>
</body>
</html>`;

// =========================================================================
// 9. SAÚDE & BEM-ESTAR
// =========================================================================
const TEMPLATE_SAUDE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instituto Vital Odonto & Saúde</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #070e12; color: #f0fdf4; min-height: 100vh; display: flex; justify-content: center; padding: 24px 14px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .clinic-header { text-align: center; margin-bottom: 22px; }
    .clinic-avatar { width: 96px; height: 96px; border-radius: 50%; border: 3px solid #10b981; margin: 0 auto 14px; object-fit: cover; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35); }
    .clinic-name { font-size: 22px; font-weight: 800; color: #fff; }
    .clinic-sub { font-size: 13px; color: #34d399; font-weight: 600; margin-top: 4px; }

    .cta-consult { display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #10b981, #059669); color: #fff; padding: 16px; border-radius: 14px; font-weight: 800; font-size: 14px; text-decoration: none; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35); }

    .treatment-card { background: #0a1f18; border: 1px solid #144634; border-radius: 14px; padding: 14px; margin-bottom: 10px; color: #fff; text-decoration: none; display: flex; justify-content: space-between; align-items: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="clinic-header">
      <img class="clinic-avatar" data-bio-image="avatar" src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80" alt="Clínica">
      <h1 class="clinic-name" data-bio-text="nome_clinica">INSTITUTO VITAL SAÚDE</h1>
      <p class="clinic-sub" data-bio-text="subtitulo">Odontologia Estética & Bem-Estar Integrativo</p>
    </div>

    <a href="https://wa.me/5511999999999" class="cta-consult" data-bio-link="whatsapp">
      <span>AGENDAR CONSULTA DE AVALIAÇÃO</span>
    </a>

    <div class="treatment-card">
      <div>
        <div style="font-weight: 700; font-size: 14px;" data-bio-text="tratamento_1">Clareamento & Facetas em Resina</div>
        <div style="font-size: 12px; color: #6ee7b7; margin-top: 2px;">Sorrisos naturais com tecnologia 3D</div>
      </div>
      <span>→</span>
    </div>
  </div>
</body>
</html>`;

// =========================================================================
// 10. PORTFÓLIO & CRIADORES
// =========================================================================
const TEMPLATE_PORTFOLIO_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Studio Vision Media & Criadores</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #08080a; color: #f4f4f5; min-height: 100vh; display: flex; justify-content: center; padding: 24px 12px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; text-align: center; }
    .creator-avatar { width: 98px; height: 98px; border-radius: 28px; border: 2px solid #a855f7; margin: 0 auto 14px; object-fit: cover; box-shadow: 0 6px 25px rgba(168, 85, 247, 0.4); }
    .creator-name { font-size: 23px; font-weight: 900; color: #fff; }
    .creator-role { font-size: 13px; color: #c084fc; font-weight: 700; margin-top: 4px; }

    .cta-hire { display: block; background: linear-gradient(135deg, #9333ea, #6b21a8); color: #fff; padding: 15px; border-radius: 14px; font-weight: 800; font-size: 14px; text-decoration: none; margin: 18px 0; box-shadow: 0 8px 24px rgba(147, 51, 234, 0.4); }
    
    .portfolio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
    .portfolio-item { background: #121118; border: 1px solid #232030; border-radius: 14px; overflow: hidden; }
    .portfolio-img { width: 100%; aspect-ratio: 16/10; object-fit: cover; }
    .portfolio-title { font-size: 12px; font-weight: 700; color: #fff; padding: 8px 6px; }
  </style>
</head>
<body>
  <div class="container">
    <img class="creator-avatar" data-bio-image="avatar" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" alt="Criador">
    <h1 class="creator-name" data-bio-text="nome_criador">Lucas Brandão</h1>
    <p class="creator-role" data-bio-text="profissao">Diretor Criativo · Filmmaker & Designer</p>

    <a href="https://wa.me/5511999999999" class="cta-hire" data-bio-link="whatsapp">
      <span>SOLICITAR ORÇAMENTO DE PROJETO</span>
    </a>

    <div class="portfolio-grid">
      <div class="portfolio-item">
        <img class="portfolio-img" data-bio-image="case_1" src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&auto=format&fit=crop&q=80" alt="Case 1">
        <div class="portfolio-title" data-bio-text="case_1_nome">Campanha Visual Alpha</div>
      </div>
      <div class="portfolio-item">
        <img class="portfolio-img" data-bio-image="case_2" src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80" alt="Case 2">
        <div class="portfolio-title" data-bio-text="case_2_nome">Sessão Fotográfica Studio</div>
      </div>
    </div>
  </div>
</body>
</html>`;

export const INITIAL_TEMPLATES: BiositeTemplate[] = [
  // 1. Barbearia
  {
    id: 'template-barbearia-luxo',
    name: 'Barbearia Luxo Titanium - Black Crown',
    nicheId: 'barbearia',
    nicheName: 'Barbearia',
    description: 'Design escuro luxuoso, cardápio de 6 especialidades, galeria de 5 fotos, link de avaliação Google e botão direto de agendamento.',
    coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_BARBEARIA_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'logo', name: 'Logo da Barbearia', type: 'logo', selector: '[data-bio-image="logo"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80' },
      { id: 'nome_empresa', name: 'Nome da Barbearia', type: 'title', selector: '[data-bio-text="nome_empresa"]', attr: 'text', originalValue: 'BLACK CROWN BARBER CLUB' },
      { id: 'headline', name: 'Slogan Principal', type: 'text', selector: '[data-bio-text="headline"]', attr: 'text', originalValue: 'SEU ESTILO COMEÇA AQUI.' },
      { id: 'whatsapp', name: 'Número do WhatsApp', type: 'whatsapp', selector: '[data-bio-link="whatsapp"]', attr: 'href', originalValue: 'https://wa.me/5531999999999' },
    ],
  },
  // 2. Beleza & Estética
  {
    id: 'template-estetica-vip',
    name: 'Estética & Harmonização Facial VIP',
    nicheId: 'beleza-estetica',
    nicheName: 'Beleza & Estética',
    description: 'Paleta rosé luxo, apresentação de autoridade médica/biomédica, lista de procedimentos e agendamento de consulta.',
    coverImage: 'https://images.unsplash.com/photo-1594824813576-71d37452d3a3?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_ESTETICA_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'avatar', name: 'Foto da Profissional', type: 'logo', selector: '[data-bio-image="avatar"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1594824813576-71d37452d3a3?w=300&auto=format&fit=crop&q=80' },
      { id: 'nome_profissional', name: 'Nome da Profissional', type: 'title', selector: '[data-bio-text="nome_profissional"]', attr: 'text', originalValue: 'Dra. Camila Vasconcelos' },
      { id: 'whatsapp', name: 'Link do WhatsApp', type: 'whatsapp', selector: '[data-bio-link="whatsapp"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
  // 3. Gastronomia & Delivery
  {
    id: 'template-restaurante-gourmet',
    name: 'The Burger Experience & Gastro Park',
    nicheId: 'gastronomia-delivery',
    nicheName: 'Gastronomia & Delivery',
    description: 'Banner imersivo, botão de cardápio digital, pedidos via WhatsApp e localização.',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_RESTAURANTE_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'avatar', name: 'Logomarca do Restaurante', type: 'logo', selector: '[data-bio-image="avatar"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80' },
      { id: 'nome_restaurante', name: 'Nome do Restaurante', type: 'title', selector: '[data-bio-text="nome_restaurante"]', attr: 'text', originalValue: 'The Burger Experience' },
      { id: 'whatsapp', name: 'Link WhatsApp Pedidos', type: 'whatsapp', selector: '[data-bio-link="whatsapp"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
  // 4. Loja & Comércio
  {
    id: 'template-loja-urban',
    name: 'Urban Style Concept Store',
    nicheId: 'loja-comercio',
    nicheName: 'Loja & Comércio',
    description: 'Catálogo de moda streetwear, vitrine de produtos e vendas diretas com consultor via WhatsApp.',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_LOJA_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'logo', name: 'Logo da Loja', type: 'logo', selector: '[data-bio-image="logo"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop&q=80' },
      { id: 'nome_loja', name: 'Nome da Loja', type: 'title', selector: '[data-bio-text="nome_loja"]', attr: 'text', originalValue: 'URBAN STYLE STORE' },
      { id: 'whatsapp', name: 'WhatsApp Vendas', type: 'whatsapp', selector: '[data-bio-link="whatsapp"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
  // 5. Formação Acadêmica
  {
    id: 'template-mentoria-expert',
    name: 'Academia & Mentoria High Level',
    nicheId: 'formacao-academica',
    nicheName: 'Formação Acadêmica',
    description: 'Autoridade acadêmica, apresentação de módulos, masterclasses e inscrição para cursos.',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_MENTORIA_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'avatar', name: 'Foto do Mentor', type: 'logo', selector: '[data-bio-image="avatar"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { id: 'nome_mentor', name: 'Nome do Mentor', type: 'title', selector: '[data-bio-text="nome_mentor"]', attr: 'text', originalValue: 'Prof. André Alcantara' },
      { id: 'inscricao', name: 'Link Inscrição', type: 'whatsapp', selector: '[data-bio-link="inscricao"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
  // 6. Serviços Profissionais
  {
    id: 'template-advocacia-elite',
    name: 'Castro Advocacia & Consultoria Estratégica',
    nicheId: 'servicos-profissionais',
    nicheName: 'Serviços Profissionais',
    description: 'Advocacia corporativa de elite, paleta dourada e preta, áreas de atuação e agendamento jurídico.',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_ADVOCACIA_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'logo', name: 'Logo do Escritório', type: 'logo', selector: '[data-bio-image="logo"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80' },
      { id: 'nome_escritorio', name: 'Nome do Escritório', type: 'title', selector: '[data-bio-text="nome_escritorio"]', attr: 'text', originalValue: 'CASTRO & ASSOCIADOS' },
      { id: 'whatsapp', name: 'Agendar Consulta', type: 'whatsapp', selector: '[data-bio-link="whatsapp"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
  // 7. Modelos Premium
  {
    id: 'template-premium-gold',
    name: 'Dark Gold Exclusive VIP Member',
    nicheId: 'modelos-premium',
    nicheName: 'Modelos Premium',
    description: 'Estética Dark Gold de alta sofisticação com lista de benefícios, concierge e clube de vantagens.',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_PREMIUM_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'avatar', name: 'Símbolo VIP', type: 'logo', selector: '[data-bio-image="avatar"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80' },
      { id: 'titulo_vip', name: 'Título VIP', type: 'title', selector: '[data-bio-text="titulo_vip"]', attr: 'text', originalValue: 'THE BLACK & GOLD CLUB' },
      { id: 'whatsapp', name: 'Solicitar Acesso', type: 'whatsapp', selector: '[data-bio-link="whatsapp"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
  // 8. Modelos Chatbot
  {
    id: 'template-chatbot-assist',
    name: 'SmartBot Atendimento Inteligente',
    nicheId: 'modelos-chatbot',
    nicheName: 'Modelos Chatbot',
    description: 'Interface simulando assistente virtual com canais rápidos de direcionamento e status online.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_CHATBOT_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'nome_bot', name: 'Nome do Assistente', type: 'title', selector: '[data-bio-text="nome_bot"]', attr: 'text', originalValue: 'SmartBot Atendimento' },
      { id: 'mensagem_boas_vindas', name: 'Boas-Vindas', type: 'text', selector: '[data-bio-text="mensagem_boas_vindas"]', attr: 'text', originalValue: 'Olá! Como posso ajudar você hoje?' },
      { id: 'canal_orcamento', name: 'Canal Orçamento', type: 'whatsapp', selector: '[data-bio-link="canal_orcamento"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
  // 9. Saúde & Bem-Estar
  {
    id: 'template-odontologia-vital',
    name: 'Instituto Vital Odonto & Saúde Integrativa',
    nicheId: 'saude-bem-estar',
    nicheName: 'Saúde & Bem-Estar',
    description: 'Tons esmeralda e saúde integrativa, apresentação de tratamentos e consulta de avaliação.',
    coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_SAUDE_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'avatar', name: 'Logo da Clínica', type: 'logo', selector: '[data-bio-image="avatar"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80' },
      { id: 'nome_clinica', name: 'Nome da Clínica', type: 'title', selector: '[data-bio-text="nome_clinica"]', attr: 'text', originalValue: 'INSTITUTO VITAL SAÚDE' },
      { id: 'whatsapp', name: 'Agendamento WhatsApp', type: 'whatsapp', selector: '[data-bio-link="whatsapp"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
  // 10. Portfólio & Criadores
  {
    id: 'template-creator-vision',
    name: 'Studio Vision Media & Criadores',
    nicheId: 'portfolio-criadores',
    nicheName: 'Portfólio & Criadores',
    description: 'Visual moderno para criadores de conteúdo, cineastas e designers exibirem portfólio com alta conversão.',
    coverImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_PORTFOLIO_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: 'avatar', name: 'Foto do Criador', type: 'logo', selector: '[data-bio-image="avatar"]', attr: 'src', originalValue: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
      { id: 'nome_criador', name: 'Nome do Criador', type: 'title', selector: '[data-bio-text="nome_criador"]', attr: 'text', originalValue: 'Lucas Brandão' },
      { id: 'whatsapp', name: 'Link WhatsApp Orçamento', type: 'whatsapp', selector: '[data-bio-link="whatsapp"]', attr: 'href', originalValue: 'https://wa.me/5511999999999' },
    ],
  },
];
