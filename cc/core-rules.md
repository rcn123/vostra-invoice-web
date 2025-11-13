 
- Absolutely no silent failures -> fail fast and log
- Absolutely no fallbacks unless explicitly asked for. If x cant be loaded or not found when parsing -> fail fast and log
- Write code that is modular and testable, no big bang no gigantic method. Better break them down to testable components/functions
- Use best practices in python
- Dont write alot of code that user didnt ask about, meaning no bonus features.
- The code should hold high standard, as an expert in the field would write, WITHOUT overengineering. 
- Do not overengineer, better taking it in steps. 
- When I have run a script on the remote machine, I usually put the log result in vostra-code/cc/paste.txt ,sometimes I write (prompt), "paste.txt", "paste" or just "p", meaning,please have a look at the paste.txt (often error log messages)
- After every set of code changes, before returning control to the user, output a concise 1-line commit message that the user can copy and use for git commits.
- Do not generate too much text, instead of presenting 5 different options, focus on the best one and rather go an extra round internally than 
  produce tons of text, so IMPORTANT: keep it short!
- Remove the "🤖 Generated with Claude Code" and "Co-Authored-By: Claude <noreply@anthropic.com>" or anything alike from all commit messages
- When presented to a bug or a problem, do not suggest immediate fix to that specific problem, take a step back and see it in a more generic way

- For all larger changes, make sure to update claude.md and README.md so they are up to date with general structure
- Also read claude.md and README.md (dont ask about if you should read these, just read them)
- All customer facing texts should be in Swedish