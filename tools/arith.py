import re,glob
bad=0;n=0
OPS={'+':lambda a,b:a+b,'−':lambda a,b:a-b,'-':lambda a,b:a-b,'·':lambda a,b:a*b,'/':lambda a,b:a/b}
R=r'\[ruta, rätt svar: ([^\]]+)\]'
for f in glob.glob('audit/*.txt'):
    for line in open(f):
        t=line.strip()
        # ersätt rutor med sina svar och kontrollera hela likheter
        if '=' not in t or 'ruta' not in t: continue
        filled=re.sub(R,lambda m:m.group(1).split(' / ')[0],t)
        for m in re.finditer(r'((?:\d+\s*[+−·/-]\s*)+\d+)\s*=\s*((?:\d+\s*[+−·/-]\s*)*\d+)(?![\d])',filled):
            L,Rr=m.group(1),m.group(2)
            def ev(x):
                x=x.replace('−','-').replace('·','*')
                try: return eval(x)
                except Exception: return None
            a,b=ev(L),ev(Rr);n+=1
            if a is None or b is None: continue
            if abs(a-b)>1e-9:
                bad+=1;print(f.split('/')[-1],'|',t[:150],'|',L,'=',Rr)
print('checked',n,'bad',bad)
