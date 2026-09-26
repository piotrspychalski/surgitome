import json,sys,matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
d=json.load(open(sys.argv[1])); st=sys.argv[3] if len(sys.argv)>3 else 'post'
fig,ax=plt.subplots(1,2,figsize=(13,8))
for o in d['objs']:
    if o['st']!=st and not (st=='post' and o['st']=='pre' and not any(x['id']==o['id'] and x['st']=='post' for x in d['objs'])): continue
    xs=[p[0] for p in o['pts']]; ys=[p[1] for p in o['pts']]; zs=[p[2] for p in o['pts']]; r=sum(p[3] for p in o['pts'])/len(o['pts'])
    for a,(u,v) in zip(ax,[(xs,ys),(zs,ys)]):
        a.plot(u,v,'-',lw=max(1,r*9),alpha=0.35,color=o['col'] if o['col'].startswith('#') else '#888',solid_capstyle='round')
        a.plot(u,v,'-',lw=0.8,color='k'); a.text(u[len(u)//2],v[len(v)//2],o['id'],fontsize=8)
        a.plot(u[-1],v[-1],'o',ms=3,color='k')
for m in d['marks']:
    xs=[p[0] for p in m['pts']]; ys=[p[1] for p in m['pts']]; zs=[p[2] for p in m['pts']]
    ax[0].plot(xs,ys,'.-',ms=2,color='r',lw=0.8); ax[1].plot(zs,ys,'.-',ms=2,color='r',lw=0.8)
ax[0].set_title('przód (x: prawa pacjenta ← → lewa)'); ax[1].set_title('bok (z: tył ← → przód)')
for a in ax: a.set_aspect('equal'); a.grid(alpha=0.3)
plt.tight_layout(); plt.savefig(sys.argv[2],dpi=70)
