"""Cost of added subtopics, in the round-3 model (F_curriculum add_item_estimates, F_timeline/I_integrated anchor).
CR per item: K missing 1.5, S missing 0.8, K partial 0.6, S partial 0.3, C 0. Text: 4 page-equivalents per added CR, +0.1 per C item.
Lesson minutes = 1.8 x page-eq + 21 x CR (anchor 70 min for 15.5 pp, 0.129 CR/page, phi 0.4). All-in (review, consultation, projects) x2."""
import json
CR={("K","missing"):1.5,("S","missing"):0.8,("K","partial"):0.6,("S","partial"):0.3}
def hours(items):
    cr=sum(CR.get((i["imp"],i.get("status","missing")),0) for i in items)
    peq=4*cr+0.1*sum(1 for i in items if i["imp"]=="C")
    return (1.8*peq+21*cr)*2/60
def load(app):
    try: return json.load(open(f"tmp/syllabus/{app}_items.json"))
    except FileNotFoundError: return {}
if __name__=="__main__":
    for app in ["eng","mil"]:
        d=load(app); tot=0; n=0
        for k,v in d.items():
            h=hours(v["items"]); tot+=h; n+=len(v["items"])
            print(f"{app} {k:5} {len(v['items']):3} items {h:5.1f} h  {v['title'][:60]}")
        print(f"== {app}: {len(d)} modules, {n} items, {tot:.0f} h all-in, {tot/154:.1f} months")
